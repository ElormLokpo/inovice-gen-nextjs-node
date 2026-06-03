
import { createClient, getClientByEmail,  assertBusinessAccess } from "./";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { ClientModel, InvoiceItemModel, InvoiceModel } from "../models";
import { CustomError, type JwtUserPayload } from "../types";


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

export const generateInvoice = async (invoiceData: any, user: JwtUserPayload) => {
    if (!invoiceData.businessId) return new CustomError("Business id is required", 400);

    const business = await assertBusinessAccess(invoiceData.businessId, user);
    if (business instanceof CustomError) return business;

    let clientId;
    const { id: clientExistsId } = await getClientByEmail(invoiceData.clientEmail, user) as typeof ClientModel.$inferSelect;


    if (!clientId) {
        const { id: newClientId } = await createClient({ businessId: invoiceData.bussinessId, ...invoiceData.clientDetails }, user) as typeof ClientModel.$inferSelect;
        clientId = newClientId;
    } else {
        clientId = clientExistsId;
    }

    const finalInvoiceData = {
        ...invoiceData,
        clientId,
        invoiceNumber: generateInvoiceNumber(),
        status: "draft",
        issueDate: new Date(),
        dueDate: new Date(invoiceData.dueDate),


    };


    const [invoice] = await db.insert(InvoiceModel).values(finalInvoiceData).returning();

    const items = invoiceData.items.map((item: any) => ({
        ...item,
        invoiceId: invoice?.id,
        amount: item.quantity * item.unitPrice,
    }));


    await db.insert(InvoiceItemModel).values(items);

    return { ...invoice, items };




}