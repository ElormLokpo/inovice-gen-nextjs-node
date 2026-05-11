import { relations } from "drizzle-orm";
import { UserModel } from "./user.model";
import { BusinessModel } from "./business.model";
import { ClientModel } from "./clients.model";
import { InvoiceModel } from "./invoices.model";
import { InvoiceItemModel } from "./invoice.item.model";
import { PaymentModel } from "./payment.model";

export const usersRelations = relations(UserModel, ({ many }) => ({
  BusinessModel: many(BusinessModel),
}));
 
export const BusinessModelRelations = relations(BusinessModel, ({ one, many }) => ({
  owner: one(UserModel, {
    fields: [BusinessModel.ownerId],
    references: [UserModel.id],
  }),
  clients: many(ClientModel),
  invoices: many(InvoiceModel),
}));
 
export const clientsRelations = relations(ClientModel, ({ one, many }) => ({
  business: one(BusinessModel, {
    fields: [ClientModel.businessId],
    references: [BusinessModel.id],
  }),
  invoices: many(InvoiceModel),
}));
 
export const invoicesRelations = relations(InvoiceModel, ({ one, many }) => ({
  business: one(BusinessModel, {
    fields: [InvoiceModel.businessId],
    references: [BusinessModel.id],
  }),
  client: one(ClientModel, {
    fields: [InvoiceModel.clientId],
    references: [ClientModel.id],
  }),
  items: many(InvoiceItemModel),
  payments: many(PaymentModel),
}));
 
export const invoiceItemsRelations = relations(InvoiceItemModel, ({ one }) => ({
  invoice: one(InvoiceModel, {
    fields: [InvoiceItemModel.invoiceId],
    references: [InvoiceModel.id],
  }),
}));
 
export const paymentsRelations = relations(PaymentModel, ({ one }) => ({
  invoice: one(InvoiceModel, {
    fields: [PaymentModel.invoiceId],
    references: [InvoiceModel.id],
  }),
}));
 