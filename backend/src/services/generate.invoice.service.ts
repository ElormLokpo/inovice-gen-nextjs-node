
import { assertBusinessAccess } from "./business.service";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { ClientModel, InvoiceItemModel, InvoiceModel } from "../models";
import { CustomError, type JwtUserPayload } from "../types";


type InvoiceItemInput = {
    partNumber?: string;
    description?: string;
    quantity?: number | string;
    unitPrice?: number | string;
    amount?: number | string;
};

type ClientDetailsInput = Partial<typeof ClientModel.$inferInsert> & {
    name?: string;
};

type GenerateInvoiceInput = {
    businessId?: string;
    clientId?: string;
    clientEmail?: string;
    clientDetails?: ClientDetailsInput;
    issueDate?: string;
    dueDate?: string;
    currency?: string;
    subtotal?: number | string;
    total?: number | string;
    totalAmount?: number | string;
    nhil?: number | string;
    getfund?: number | string;
    covid?: number | string;
    vat?: number | string;
    nhilAmount?: number | string;
    getfundAmount?: number | string;
    covidAmount?: number | string;
    vatAmount?: number | string;
    items?: InvoiceItemInput[];
    invoiceItems?: InvoiceItemInput[];
};

const toNumber = (value: number | string | undefined, fallback = 0) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
};

const toDecimal = (value: number | string | undefined, fallback = 0) =>
    toNumber(value, fallback).toFixed(2);

const toDateString = (value?: string) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return null;

    return date.toISOString().slice(0, 10);
};

const findClientByEmailForBusiness = async (email: string | undefined, businessId: string) => {
    if (!email) return null;

    const [client] = await db
        .select()
        .from(ClientModel)
        .where(and(eq(ClientModel.email, email), eq(ClientModel.businessId, businessId)));

    return client ?? null;
};

export const assertInvoiceAccess = async (invoiceId: string, user: JwtUserPayload) => {
    if (!invoiceId) return new CustomError("Invoice id is required", 400);

    const [invoice] = await db.select().from(InvoiceModel).where(eq(InvoiceModel.id, invoiceId));

    if (!invoice) return new CustomError("Invoice not found", 404);

    const business = await assertBusinessAccess(invoice.businessId, user);
    if (business instanceof CustomError) return business;

    return invoice;
};

export const listInvoices = async (businessId: string, user: JwtUserPayload) => {
    const business = await assertBusinessAccess(businessId, user);
    if (business instanceof CustomError) return business;

    return db.select().from(InvoiceModel).where(eq(InvoiceModel.businessId, businessId));
};

export const getInvoice = async (invoiceId: string, user: JwtUserPayload) => {
    const invoice = await assertInvoiceAccess(invoiceId, user);
    if (invoice instanceof CustomError) return invoice;

    const items = await db.select().from(InvoiceItemModel).where(eq(InvoiceItemModel.invoiceId, invoiceId));
    return { ...invoice, items };
};



export const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${timestamp}-${randomString}`;
}

export const generateInvoice = async (invoiceData: GenerateInvoiceInput, user: JwtUserPayload) => {
    if (!invoiceData.businessId) return new CustomError("Business id is required", 400);

    const business = await assertBusinessAccess(invoiceData.businessId, user);
    if (business instanceof CustomError) return business;

    const invoiceItems = invoiceData.items ?? invoiceData.invoiceItems ?? [];
    if (!invoiceItems.length) return new CustomError("At least one invoice item is required", 400);

    const issueDate = toDateString(invoiceData.issueDate);
    const dueDate = toDateString(invoiceData.dueDate);
    if (!issueDate || !dueDate) return new CustomError("Valid issue and due dates are required", 400);

    let clientId = invoiceData.clientId;

    if (clientId) {
        const [client] = await db
            .select()
            .from(ClientModel)
            .where(and(eq(ClientModel.id, clientId), eq(ClientModel.businessId, invoiceData.businessId)));

        if (!client) return new CustomError("Client not found for this business", 404);
    }

    if (!clientId) {
        const existingClient = await findClientByEmailForBusiness(
            invoiceData.clientEmail ?? invoiceData.clientDetails?.email ?? undefined,
            invoiceData.businessId,
        );

        if (existingClient) {
            clientId = existingClient.id;
        }
    }

    if (!clientId) {
        const clientDetails = invoiceData.clientDetails;
        if (!clientDetails?.name) return new CustomError("Client name is required", 400);

        const [newClient] = await db
            .insert(ClientModel)
            .values({
                businessId: invoiceData.businessId,
                name: clientDetails.name,
                email: clientDetails.email,
                phone: clientDetails.phone,
                address: clientDetails.address,
                city: clientDetails.city,
                country: clientDetails.country,
            })
            .returning();

        if (!newClient) return new CustomError("Unable to create client", 500);

        clientId = newClient.id;
    }

    const normalizedItems = invoiceItems.map((item) => {
        const quantity = toNumber(item.quantity);
        const unitPrice = toNumber(item.unitPrice);
        const amount = toNumber(item.amount, quantity * unitPrice);

        return {
            partNumber: item.partNumber?.trim() || "N/A",
            description: item.description?.trim() || "Invoice item",
            quantity: toDecimal(quantity),
            unitPrice: toDecimal(unitPrice),
            amount: toDecimal(amount),
        };
    });

    const subtotal = toNumber(
        invoiceData.subtotal,
        normalizedItems.reduce((sum, item) => sum + toNumber(item.amount), 0),
    );
    const nhilAmount = toNumber(invoiceData.nhilAmount);
    const getfundAmount = toNumber(invoiceData.getfundAmount);
    const covidAmount = toNumber(invoiceData.covidAmount);
    const vatAmount = toNumber(invoiceData.vatAmount);
    const totalAmount = toNumber(
        invoiceData.totalAmount,
        subtotal + nhilAmount + getfundAmount + covidAmount + vatAmount,
    );

    const [invoice] = await db.insert(InvoiceModel).values({
        businessId: invoiceData.businessId,
        clientId,
        invoiceNumber: generateInvoiceNumber(),
        status: "draft",
        issueDate,
        dueDate,
        currency: invoiceData.currency ?? business.currency ?? "GHS",
        subtotal: toDecimal(subtotal),
        nhilAmount: toDecimal(nhilAmount),
        getfundAmount: toDecimal(getfundAmount),
        covidAmount: toDecimal(covidAmount),
        vatAmount: toDecimal(vatAmount),
        totalAmount: toDecimal(totalAmount),
        nhil: toDecimal(invoiceData.nhil),
        getfund: toDecimal(invoiceData.getfund),
        covid: toDecimal(invoiceData.covid),
        vat: toDecimal(invoiceData.vat),
    }).returning();

    if (!invoice) return new CustomError("Unable to create invoice", 500);

    const items = normalizedItems.map((item) => ({
        ...item,
        invoiceId: invoice.id,
    }));


    await db.insert(InvoiceItemModel).values(items);

    return { ...invoice, items };




}
