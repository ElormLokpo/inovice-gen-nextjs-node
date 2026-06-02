import { Router } from "express";
import { requireAuth, requireVerifiedEmail, requireWriteAccess } from "../middleware/auth.middleware";
import { CreateInvoiceController } from "../controllers/generate.invoice.controller";

export const invoiceRoutes = Router();

invoiceRoutes.use(requireAuth, requireVerifiedEmail);
invoiceRoutes.post("/", requireWriteAccess, CreateInvoiceController);