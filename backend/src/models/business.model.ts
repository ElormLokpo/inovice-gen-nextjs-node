import {
  pgTable,
  uuid,
  text,
 
} from "drizzle-orm/pg-core";
import { UserModel } from "./user.model";
import { timestamps } from "./timestamps";

export const BusinessModel = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => UserModel.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  taxId: text("tax_id"),
  currency: text("currency").notNull().default("USD"),
    ...timestamps
});