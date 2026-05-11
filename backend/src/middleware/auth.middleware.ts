import type { NextFunction, Response } from "express";
import { CustomError, type AuthenticatedRequest, type UserRole } from "../types";
import { verifyJwt } from "../utils/jwt.gen";

const readBearerToken = (authorization?: string) => {
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length).trim();
};

export const requireAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = readBearerToken(req.headers.authorization);

    if (!token) {
      next(new CustomError("Authentication required", 401));
      return;
    }

    req.user = await verifyJwt(token);
    next();
  } catch {
    next(new CustomError("Invalid or expired token", 401));
  }
};

export const requireVerifiedEmail = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user?.emailVerified) {
    next(new CustomError("Email confirmation required", 403));
    return;
  }

  next();
};

export const requireRoles =
  (...roles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new CustomError("Insufficient permissions", 403));
      return;
    }

    next();
  };

export const requireWriteAccess = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (req.user?.role === "guest") {
    next(new CustomError("Guests have read-only access", 403));
    return;
  }

  next();
};
