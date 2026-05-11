import { Router } from "express";
import {
  CreateBusinessController,
  DeleteBusinessController,
  GetBusinessController,
  ListBusinessesController,
  UpdateBusinessController,
} from "../controllers/business.controller";
import { requireAuth, requireVerifiedEmail, requireWriteAccess } from "../middleware/auth.middleware";

export const businessRoutes = Router();

businessRoutes.use(requireAuth, requireVerifiedEmail);
businessRoutes.get("/", ListBusinessesController);
businessRoutes.get("/:id", GetBusinessController);
businessRoutes.post("/", requireWriteAccess, CreateBusinessController);
businessRoutes.put("/:id", requireWriteAccess, UpdateBusinessController);
businessRoutes.delete("/:id", requireWriteAccess, DeleteBusinessController);
