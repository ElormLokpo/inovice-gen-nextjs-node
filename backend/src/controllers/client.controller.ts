import type { NextFunction, Response } from "express";
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} from "../services/client.service";
import { CustomError, type AuthenticatedRequest } from "../types";

const handleResult = (res: Response, next: NextFunction, result: unknown, status = 200) => {
  if (result instanceof CustomError) {
    next(result);
    return;
  }

  res.status(status).json({ success: true, data: result });
};

export const ListClientsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await listClients(String(req.query.businessId ?? ""), req.user!));
  } catch (error) {
    next(error);
  }
};

export const GetClientController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await getClient(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};

export const CreateClientController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await createClient(req.body, req.user!), 201);
  } catch (error) {
    next(error);
  }
};

export const UpdateClientController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await updateClient(String(req.params.id), req.body, req.user!));
  } catch (error) {
    next(error);
  }
};

export const DeleteClientController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await deleteClient(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};
