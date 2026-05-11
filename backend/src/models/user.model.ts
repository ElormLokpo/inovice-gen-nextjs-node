import { pgEnum, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps";


export const userRoles = pgEnum("user_roles", ["admin", "user", "guest"]);

export const UserModel = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: userRoles("role").notNull().default("user"),
  emailVerifiedAt: timestamp("email_verified_at"),
  emailVerificationTokenHash: text("email_verification_token_hash"),
  passwordResetTokenHash: text("password_reset_token_hash"),
  passwordResetExpiresAt: timestamp("password_reset_expires_at"),
  ...timestamps,
});
