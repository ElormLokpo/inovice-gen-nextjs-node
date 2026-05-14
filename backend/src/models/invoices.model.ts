import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { BusinessModel } from "./business.model";
import { ClientModel } from "./clients.model";
import { timestamps } from "./timestamps";


export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
]);

export const InvoiceModel = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => BusinessModel.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => ClientModel.id, { onDelete: "restrict" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  status: invoiceStatusEnum("status").notNull().default("draft"),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  currency: text("currency").notNull().default("GHS"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  paymentTerms: text("payment_terms"),
  paidAt: timestamp("paid_at"),
  ...timestamps
});