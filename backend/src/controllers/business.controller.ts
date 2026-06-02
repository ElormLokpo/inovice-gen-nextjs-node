import type { NextFunction, Response } from "express";
import {
  createBusiness,
  deleteBusiness,
  getBusiness,
  listBusinesses,
  updateBusiness,
} from "../services/business.service";
import {  type AuthenticatedRequest } from "../types";
import { handleResult } from "../utils";


export const ListBusinessesController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await listBusinesses(req.user!));
  } catch (error) {
    next(error);
  }
};

export const GetBusinessController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await getBusiness(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};

export const CreateBusinessController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await createBusiness(req.body, req.user!), 201);
  } catch (error) {
    next(error);
  }
};

export const UpdateBusinessController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await updateBusiness(String(req.params.id), req.body, req.user!));
  } catch (error) {
    next(error);
  }
};

export const DeleteBusinessController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    handleResult(res, next, await deleteBusiness(String(req.params.id), req.user!));
  } catch (error) {
    next(error);
  }
};
