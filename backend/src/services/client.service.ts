import { eq } from "drizzle-orm";
import { db } from "../db";
import { ClientModel } from "../models";
import { CustomError, type JwtUserPayload } from "../types";
import { assertBusinessAccess } from "./";

export const assertClientAccess = async (clientId: string, user: JwtUserPayload) => {
  if (!clientId) return new CustomError("Client id is required", 400);

  const [client] = await db.select().from(ClientModel).where(eq(ClientModel.id, clientId));

  if (!client) return new CustomError("Client not found", 404);

  const business = await assertBusinessAccess(client.businessId, user);
  if (business instanceof CustomError) return business;

  return client;
};

export const listClients = async (businessId: string, user: JwtUserPayload) => {
  const business = await assertBusinessAccess(businessId, user);
  if (business instanceof CustomError) return business;

  return db.select().from(ClientModel).where(eq(ClientModel.businessId, businessId));
};

export const getClient = async (clientId: string, user: JwtUserPayload) =>
  assertClientAccess(clientId, user);

export const getClientByEmail = async (email: string, user: JwtUserPayload) => {
  if (!email) return new CustomError("Email is required", 400);

  const [client] = await db.select().from(ClientModel).where(eq(ClientModel.email , email));

  if (!client) return new CustomError("Client not found", 404);

  return client;
}

export const createClient = async (payload: typeof ClientModel.$inferInsert, user: JwtUserPayload) => {
  if (!payload.businessId) return new CustomError("Business id is required", 400);

  const business = await assertBusinessAccess(payload.businessId, user);
  if (business instanceof CustomError) return business;

  const [client] = await db.insert(ClientModel).values(payload).returning();
  return client;
};

export const updateClient = async (
  clientId: string,
  payload: Partial<typeof ClientModel.$inferInsert>,
  user: JwtUserPayload,
) => {
  const client = await assertClientAccess(clientId, user);
  if (client instanceof CustomError) return client;

  const { id: _id, createdAt: _createdAt, businessId: _businessId, ...updates } = payload as Partial<typeof ClientModel.$inferSelect>;
  const [updatedClient] = await db
    .update(ClientModel)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(ClientModel.id, clientId))
    .returning();

  return updatedClient;
};

export const deleteClient = async (clientId: string, user: JwtUserPayload) => {
  const client = await assertClientAccess(clientId, user);
  if (client instanceof CustomError) return client;

  const [deletedClient] = await db.delete(ClientModel).where(eq(ClientModel.id, clientId)).returning();
  return deletedClient;
};
