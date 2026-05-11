import {
  pgTable,
  uuid,
  text,
  numeric,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";
import { InvoiceModel } from "./invoices.model";
import { timestamps } from "./timestamps";

export const paymentMethodEnum = pgEnum("payment_method", [
  "bank_transfer",
  "cash",
  "mobile_money",
  "card",
  "other",
]);

export const PaymentModel = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => InvoiceModel.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  reference: text("reference"),
  paymentDate: date("payment_date").notNull(),
  notes: text("notes"),
  ...timestamps
});