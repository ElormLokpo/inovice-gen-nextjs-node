import { Router } from "express";
import {
  CreateInvoiceController,
  DeleteInvoiceController,
  GetInvoiceController,
  ListInvoicesController,
  UpdateInvoiceController,
} from "../controllers/invoice.controller";
import { requireAuth, requireVerifiedEmail, requireWriteAccess } from "../middleware/auth.middleware";

export const invoiceRoutes = Router();

invoiceRoutes.use(requireAuth, requireVerifiedEmail);
invoiceRoutes.get("/", ListInvoicesController);
invoiceRoutes.get("/:id", GetInvoiceController);
invoiceRoutes.post("/", requireWriteAccess, CreateInvoiceController);
invoiceRoutes.put("/:id", requireWriteAccess, UpdateInvoiceController);
invoiceRoutes.delete("/:id", requireWriteAccess, DeleteInvoiceController);
