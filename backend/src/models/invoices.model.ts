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
  nhilAmount: numeric("nhil_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  getfundAmount: numeric("getfund_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  covidAmount: numeric("covid_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  vatAmount: numeric("vat_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  nhil: numeric("nhil", { precision: 10, scale: 2 }).notNull().default("0"),
  getfund: numeric("getfund", { precision: 10, scale: 2 }).notNull().default("0"),
  covid: numeric("covid", { precision: 10, scale: 2 }).notNull().default("0"),
  vat: numeric("vat", { precision: 10, scale: 2 }).notNull().default("0"),
  
  paidAt: timestamp("paid_at"),
  ...timestamps
});