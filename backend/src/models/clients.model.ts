import {
  pgTable,
  uuid,
  text,
 
} from "drizzle-orm/pg-core";
import { BusinessModel } from "./business.model";
import { timestamps } from "./timestamps";


export const ClientModel = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => BusinessModel.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  notes: text("notes"),
  ...timestamps
});