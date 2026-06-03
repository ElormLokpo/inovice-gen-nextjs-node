import type { NextFunction, Response } from "express";
import { createPayment, deletePayment, listPayments } from "../services/payment.service";
import { type AuthenticatedRequest } from "../types";
import { handleResult } from "../utils";

export const ListPaymentsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await listPayments(String(req.query.invoiceId ?? ""), req.user!));
  } catch (error) {
    next(error);
  }
};

export const CreatePaymentController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await createPayment(req.body, req.user!), 201);
  } catch (error) {
    next(error);
  }
};

export const DeletePaymentController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await deletePayment(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};
