import { Router } from "express";
import {
  CreateClientController,
  DeleteClientController,
  GetClientController,
  ListClientsController,
  UpdateClientController,
} from "../controllers/client.controller";
import { requireAuth, requireVerifiedEmail, requireWriteAccess } from "../middleware/auth.middleware";

export const clientRoutes = Router();

clientRoutes.use(requireAuth, requireVerifiedEmail);
clientRoutes.get("/", ListClientsController);
clientRoutes.get("/:id", GetClientController);
clientRoutes.post("/", requireWriteAccess, CreateClientController);
clientRoutes.put("/:id", requireWriteAccess, UpdateClientController);
clientRoutes.delete("/:id", requireWriteAccess, DeleteClientController);
