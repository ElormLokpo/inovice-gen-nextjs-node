import { eq } from "drizzle-orm";
import { db } from "../db";
import { BusinessModel } from "../models";
import { CustomError, type JwtUserPayload } from "../types";

const canAccessBusiness = (user: JwtUserPayload, business: typeof BusinessModel.$inferSelect) =>
  user.role === "admin" || business.ownerId === user.id;

export const assertBusinessAccess = async (businessId: string, user: JwtUserPayload) => {
  if (!businessId) return new CustomError("Business id is required", 400);

  const [business] = await db.select().from(BusinessModel).where(eq(BusinessModel.id, businessId));

  if (!business) return new CustomError("Business not found", 404);
  if (!canAccessBusiness(user, business)) return new CustomError("Insufficient permissions", 403);

  return business;
};

export const listBusinesses = async (user: JwtUserPayload) => {
  if (user.role === "admin") return db.select().from(BusinessModel);
  return db.select().from(BusinessModel).where(eq(BusinessModel.ownerId, user.id));
};

export const getBusiness = async (businessId: string, user: JwtUserPayload) =>
  assertBusinessAccess(businessId, user);

export const createBusiness = async (payload: typeof BusinessModel.$inferInsert, user: JwtUserPayload) => {
  const ownerId = user.role === "admin" && payload.ownerId ? payload.ownerId : user.id;
  const [business] = await db.insert(BusinessModel).values({ ...payload, ownerId }).returning();
  return business;
};

export const updateBusiness = async (
  businessId: string,
  payload: Partial<typeof BusinessModel.$inferInsert>,
  user: JwtUserPayload,
) => {
  const business = await assertBusinessAccess(businessId, user);
  if (business instanceof CustomError) return business;

  const { id, createdAt, ownerId, ...updates } = payload as Partial<typeof BusinessModel.$inferSelect>;
  const [updatedBusiness] = await db
    .update(BusinessModel)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(BusinessModel.id, businessId))
    .returning();

  return updatedBusiness;
};

export const deleteBusiness = async (businessId: string, user: JwtUserPayload) => {
  const business = await assertBusinessAccess(businessId, user);
  if (business instanceof CustomError) return business;

  const [deletedBusiness] = await db
    .delete(BusinessModel)
    .where(eq(BusinessModel.id, businessId))
    .returning();

  return deletedBusiness;
};
