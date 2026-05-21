import { Router } from "express";
import { CreateCloudinaryUploadSignatureController } from "../controllers/upload.controller";
import { requireAuth, requireVerifiedEmail } from "../middleware/auth.middleware";

export const uploadRoutes = Router();

uploadRoutes.use(requireAuth, requireVerifiedEmail);
uploadRoutes.post("/cloudinary/signature", CreateCloudinaryUploadSignatureController);
