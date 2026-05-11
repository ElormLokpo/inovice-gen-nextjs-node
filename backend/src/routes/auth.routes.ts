import { Router } from "express";
import {
  ConfirmEmailController,
  ForgotPasswordController,
  LoginUserController,
  RegisterUserController,
  ResendConfirmationController,
  ResetPasswordController,
} from "../controllers/auth.controller";


export const authRoutes  = Router();

authRoutes.post("/register", RegisterUserController)
authRoutes.post("/login", LoginUserController)
authRoutes.post("/forgot-password", ForgotPasswordController)
authRoutes.post("/reset-password", ResetPasswordController)
authRoutes.get("/confirm-email", ConfirmEmailController)
authRoutes.post("/confirm-email", ConfirmEmailController)
authRoutes.post("/resend-confirmation", ResendConfirmationController)
