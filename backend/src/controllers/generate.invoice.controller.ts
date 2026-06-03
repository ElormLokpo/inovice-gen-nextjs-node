import type { NextFunction, Response } from "express";
import {  type AuthenticatedRequest } from "../types";
import { generateInvoice } from "../services/generate.invoice.service";
import { handleResult } from "../utils";


export const CreateInvoiceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await generateInvoice(req.body, req.user!), 201);
  } catch (error) {
    next(error);
  }
};