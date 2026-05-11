import { eq } from "drizzle-orm";
import { db } from "../db";
import { InvoiceItemModel } from "../models";
import { CustomError, type JwtUserPayload } from "../types";
import { assertInvoiceAccess, recalculateInvoiceTotals } from "./invoice.service";

const money = (value: unknown) => Number(value ?? 0);
const decimal = (value: number) => value.toFixed(2);

const withAmount = (payload: typeof InvoiceItemModel.$inferInsert) => {
  const quantity = money(payload.quantity);
  const unitPrice = money(payload.unitPrice);
  const taxRate = money(payload.taxRate);
  const subtotal = quantity * unitPrice;

  return {
    ...payload,
    quantity: decimal(quantity),
    unitPrice: decimal(unitPrice),
    taxRate: decimal(taxRate),
    amount: decimal(subtotal + (subtotal * taxRate) / 100),
  };
};

export const listInvoiceItems = async (invoiceId: string, user: JwtUserPayload) => {
  if (!invoiceId) return new CustomError("Invoice id is required", 400);

  const invoice = await assertInvoiceAccess(invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  return db.select().from(InvoiceItemModel).where(eq(InvoiceItemModel.invoiceId, invoiceId));
};

export const createInvoiceItem = async (payload: typeof InvoiceItemModel.$inferInsert, user: JwtUserPayload) => {
  if (!payload.invoiceId) return new CustomError("Invoice id is required", 400);

  const invoice = await assertInvoiceAccess(payload.invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  const [item] = await db.insert(InvoiceItemModel).values(withAmount(payload)).returning();
  await recalculateInvoiceTotals(payload.invoiceId);
  return item;
};

export const updateInvoiceItem = async (
  itemId: string,
  payload: Partial<typeof InvoiceItemModel.$inferInsert>,
  user: JwtUserPayload,
) => {
  if (!itemId) return new CustomError("Invoice item id is required", 400);

  const [item] = await db.select().from(InvoiceItemModel).where(eq(InvoiceItemModel.id, itemId));
  if (!item) return new CustomError("Invoice item not found", 404);

  const invoice = await assertInvoiceAccess(item.invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  const nextItem = withAmount({ ...item, ...payload, invoiceId: item.invoiceId });
  const { id, ...updates } = nextItem;

  const [updatedItem] = await db
    .update(InvoiceItemModel)
    .set(updates)
    .where(eq(InvoiceItemModel.id, itemId))
    .returning();

  await recalculateInvoiceTotals(item.invoiceId);
  return updatedItem;
};

export const deleteInvoiceItem = async (itemId: string, user: JwtUserPayload) => {
  if (!itemId) return new CustomError("Invoice item id is required", 400);

  const [item] = await db.select().from(InvoiceItemModel).where(eq(InvoiceItemModel.id, itemId));
  if (!item) return new CustomError("Invoice item not found", 404);

  const invoice = await assertInvoiceAccess(item.invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  const [deletedItem] = await db.delete(InvoiceItemModel).where(eq(InvoiceItemModel.id, itemId)).returning();
  await recalculateInvoiceTotals(item.invoiceId);
  return deletedItem;
};
