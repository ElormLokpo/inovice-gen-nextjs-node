import { eq } from "drizzle-orm";
import { db } from "../db";
import { PaymentModel } from "../models";
import { CustomError, type JwtUserPayload } from "../types";
import { assertInvoiceAccess } from "./";

export const listPayments = async (invoiceId: string, user: JwtUserPayload) => {
  if (!invoiceId) return new CustomError("Invoice id is required", 400);

  const invoice = await assertInvoiceAccess(invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  return db.select().from(PaymentModel).where(eq(PaymentModel.invoiceId, invoiceId));
};

export const createPayment = async (payload: typeof PaymentModel.$inferInsert, user: JwtUserPayload) => {
  if (!payload.invoiceId) return new CustomError("Invoice id is required", 400);

  const invoice = await assertInvoiceAccess(payload.invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  const [payment] = await db.insert(PaymentModel).values(payload).returning();
  return payment;
};

export const deletePayment = async (paymentId: string, user: JwtUserPayload) => {
  if (!paymentId) return new CustomError("Payment id is required", 400);

  const [payment] = await db.select().from(PaymentModel).where(eq(PaymentModel.id, paymentId));
  if (!payment) return new CustomError("Payment not found", 404);

  const invoice = await assertInvoiceAccess(payment.invoiceId, user);
  if (invoice instanceof CustomError) return invoice;

  const [deletedPayment] = await db.delete(PaymentModel).where(eq(PaymentModel.id, paymentId)).returning();
  return deletedPayment;
};
