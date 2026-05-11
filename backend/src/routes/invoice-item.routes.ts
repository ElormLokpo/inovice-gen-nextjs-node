import { Router } from "express";
import {
  CreateInvoiceItemController,
  DeleteInvoiceItemController,
  ListInvoiceItemsController,
  UpdateInvoiceItemController,
} from "../controllers/invoice-item.controller";
import { requireAuth, requireVerifiedEmail, requireWriteAccess } from "../middleware/auth.middleware";

export const invoiceItemRoutes = Router();

invoiceItemRoutes.use(requireAuth, requireVerifiedEmail);
invoiceItemRoutes.get("/", ListInvoiceItemsController);
invoiceItemRoutes.post("/", requireWriteAccess, CreateInvoiceItemController);
invoiceItemRoutes.put("/:id", requireWriteAccess, UpdateInvoiceItemController);
invoiceItemRoutes.delete("/:id", requireWriteAccess, DeleteInvoiceItemController);
