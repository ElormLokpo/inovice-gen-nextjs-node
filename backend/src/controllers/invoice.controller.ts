import type { NextFunction, Response } from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  listInvoices,
  updateInvoice,
} from "../services/invoice.service";
import { CustomError, type AuthenticatedRequest } from "../types";

const handleResult = (res: Response, next: NextFunction, result: unknown, status = 200) => {
  if (result instanceof CustomError) {
    next(result);
    return;
  }

  res.status(status).json({ success: true, data: result });
};

export const ListInvoicesController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await listInvoices(String(req.query.businessId ?? ""), req.user!));
  } catch (error) {
    next(error);
  }
};

export const GetInvoiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await getInvoice(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};

export const CreateInvoiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await createInvoice(req.body, req.user!), 201);
  } catch (error) {
    next(error);
  }
};

export const UpdateInvoiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await updateInvoice(String(req.params.id), req.body, req.user!));
  } catch (error) {
    next(error);
  }
};

export const DeleteInvoiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await deleteInvoice(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};
