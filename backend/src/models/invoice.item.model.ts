import {
  pgTable,
  uuid,
  text,
  numeric,

} from "drizzle-orm/pg-core";
import { InvoiceModel } from "./invoices.model";

export const InvoiceItemModel = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => InvoiceModel.id, { onDelete: "cascade" }),
  partNumber: text("part_number").notNull(),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

});