import type { NextFunction, Response } from "express";
import { CustomError } from "../types";


export const handleResult = (res: Response, next: NextFunction, result: unknown, status = 200) => {
  if (result instanceof CustomError) {
    next(result);
    return;
  }

  res.status(status).json({ success: true, data: result });
};

export const frontendUrl = () => process.env.FRONTEND_URL ?? process.env.APP_URL ?? "http://localhost:3000";
