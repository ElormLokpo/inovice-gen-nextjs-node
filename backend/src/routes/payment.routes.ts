import { Router } from "express";
import {
  CreatePaymentController,
  DeletePaymentController,
  ListPaymentsController,
} from "../controllers/payment.controller";
import { requireAuth, requireVerifiedEmail, requireWriteAccess } from "../middleware/auth.middleware";

export const paymentRoutes = Router();

paymentRoutes.use(requireAuth, requireVerifiedEmail);
paymentRoutes.get("/", ListPaymentsController);
paymentRoutes.post("/", requireWriteAccess, CreatePaymentController);
paymentRoutes.delete("/:id", requireWriteAccess, DeletePaymentController);
