import type { NextFunction, Request, Response } from "express";
import { createCloudinaryUploadSignature } from "../services/cloudinary.service";

export const CreateCloudinaryUploadSignatureController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const signature = createCloudinaryUploadSignature({
      folder: typeof req.body.folder === "string" ? req.body.folder : undefined,
    });

    res.status(200).json({ success: true, data: signature });
  } catch (error) {
    next(error);
  }
};
