import { eq } from "drizzle-orm";
import { db } from "../db";
import { ClientModel, InvoiceItemModel, InvoiceModel } from "../models";
import { CustomError, type JwtUserPayload } from "../types";
import { assertBusinessAccess } from "./business.service";

type InvoiceItemInput = Omit<typeof InvoiceItemModel.$inferInsert, "invoiceId" | "amount"> & {
  amount?: string;
};

type InvoiceInput = typeof InvoiceModel.$inferInsert & {
  items?: InvoiceItemInput[];
  taxAmount?: string;
  discountAmount?: string;
};

const money = (value: unknown) => Number(value ?? 0);
const decimal = (value: number) => value.toFixed(2);

const calculateItems = (items: InvoiceItemInput[] = []) => {
  return items.map((item, index) => {
    const quantity = money(item.quantity);
    const unitPrice = money(item.unitPrice);
    const taxRate = money(item.taxRate);
    const lineSubtotal = quantity * unitPrice;
    const amount = lineSubtotal + (lineSubtotal * taxRate) / 100;

    return {
      ...item,
      quantity: decimal(quantity),
      unitPrice: decimal(unitPrice),
      taxRate: decimal(taxRate),
      amount: decimal(amount),
      sortOrder: item.sortOrder ?? index,
    };
  });
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

export const createInvoice = async (payload: InvoiceInput, user: JwtUserPayload) => {
  if (!payload.businessId) return new CustomError("Business id is required", 400);
  if (!payload.clientId) return new CustomError("Client id is required", 400);

  const business = await assertBusinessAccess(payload.businessId, user);
  if (business instanceof CustomError) return business;

  const [client] = await db.select().from(ClientModel).where(eq(ClientModel.id, payload.clientId));
  if (!client || client.businessId !== payload.businessId) {
    return new CustomError("Client does not belong to this business", 400);
  }

  const items = calculateItems(payload.items);
  const subtotal = items.reduce((sum, item) => sum + money(item.quantity) * money(item.unitPrice), 0);
  const itemTax = items.reduce((sum, item) => sum + (money(item.quantity) * money(item.unitPrice) * money(item.taxRate)) / 100, 0);
  const taxAmount = payload.taxAmount ? money(payload.taxAmount) : itemTax;
  const discountAmount = money(payload.discountAmount);
  const total = subtotal + taxAmount - discountAmount;
  const { items: _items, ...invoicePayload } = payload;

  const [invoice] = await db
    .insert(InvoiceModel)
    .values({
      ...invoicePayload,
      subtotal: decimal(subtotal),
      taxAmount: decimal(taxAmount),
      discountAmount: decimal(discountAmount),
      total: decimal(total),
    })
    .returning();
  if (!invoice) return new CustomError("Unable to create invoice", 500);

  const createdItems = items.length
    ? await db
      .insert(InvoiceItemModel)
      .values(items.map((item) => ({ ...item, invoiceId: invoice.id })))
      .returning()
    : [];

  return { ...invoice, items: createdItems };
};

export const updateInvoice = async (
  invoiceId: string,
  payload: Partial<InvoiceInput>,
  user: JwtUserPayload,
) => {
  const invoice = await assertInvoiceAccess(invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  const {
    id: _id,
    createdAt: _createdAt,
    businessId: _businessId,
    clientId: _clientId,
    items: _items,
    ...updates
  } = payload as Partial<InvoiceInput & typeof InvoiceModel.$inferSelect>;

  const [updatedInvoice] = await db
    .update(InvoiceModel)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(InvoiceModel.id, invoiceId))
    .returning();

  return updatedInvoice;
};

export const deleteInvoice = async (invoiceId: string, user: JwtUserPayload) => {
  const invoice = await assertInvoiceAccess(invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  const [deletedInvoice] = await db.delete(InvoiceModel).where(eq(InvoiceModel.id, invoiceId)).returning();
  return deletedInvoice;
};

export const recalculateInvoiceTotals = async (invoiceId: string) => {
  const [invoice] = await db.select().from(InvoiceModel).where(eq(InvoiceModel.id, invoiceId));
  if (!invoice) return new CustomError("Invoice not found", 404);

  const items = await db.select().from(InvoiceItemModel).where(eq(InvoiceItemModel.invoiceId, invoiceId));
  const subtotal = items.reduce((sum, item) => sum + money(item.quantity) * money(item.unitPrice), 0);
  const taxAmount = items.reduce((sum, item) => sum + money(item.amount) - money(item.quantity) * money(item.unitPrice), 0);
  const discountAmount = money(invoice.discountAmount);
  const total = subtotal + taxAmount - discountAmount;

  const [updatedInvoice] = await db
    .update(InvoiceModel)
    .set({
      subtotal: decimal(subtotal),
      taxAmount: decimal(taxAmount),
      total: decimal(total),
      updatedAt: new Date(),
    })
    .where(eq(InvoiceModel.id, invoiceId))
    .returning();

  return updatedInvoice;
};
