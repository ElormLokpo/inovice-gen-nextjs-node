import type { NextFunction, Response } from "express";
import {
  createInvoiceItem,
  deleteInvoiceItem,
  listInvoiceItems,
  updateInvoiceItem,
} from "../services/invoice-item.service";
import { CustomError, type AuthenticatedRequest } from "../types";

const handleResult = (res: Response, next: NextFunction, result: unknown, status = 200) => {
  if (result instanceof CustomError) {
    next(result);
    return;
  }

  res.status(status).json({ success: true, data: result });
};

export const ListInvoiceItemsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await listInvoiceItems(String(req.query.invoiceId ?? ""), req.user!));
  } catch (error) {
    next(error);
  }
};

export const CreateInvoiceItemController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await createInvoiceItem(req.body, req.user!), 201);
  } catch (error) {
    next(error);
  }
};

export const UpdateInvoiceItemController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await updateInvoiceItem(String(req.params.id), req.body, req.user!));
  } catch (error) {
    next(error);
  }
};

export const DeleteInvoiceItemController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await deleteInvoiceItem(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};
