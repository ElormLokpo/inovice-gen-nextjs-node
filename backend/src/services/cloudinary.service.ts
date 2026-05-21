import { createHash } from "node:crypto";
import { CustomError } from "../types";

type CloudinaryConfig = {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
};

type SignUploadInput = {
  folder?: string;
};

export const parseCloudinaryUrl = (cloudinaryUrl = process.env.CLOUDINARY_URL): CloudinaryConfig => {
  if (!cloudinaryUrl) {
    throw new CustomError("CLOUDINARY_URL is required", 500);
  }

  const parsedUrl = new URL(cloudinaryUrl);

  if (parsedUrl.protocol !== "cloudinary:") {
    throw new CustomError("Invalid CLOUDINARY_URL protocol", 500);
  }

  const apiKey = decodeURIComponent(parsedUrl.username);
  const apiSecret = decodeURIComponent(parsedUrl.password);
  const cloudName = parsedUrl.hostname;

  if (!apiKey || !apiSecret || !cloudName) {
    throw new CustomError("Invalid CLOUDINARY_URL format", 500);
  }

  return { apiKey, apiSecret, cloudName };
};

const signParams = (params: Record<string, string | number>, apiSecret: string) => {
  const signaturePayload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${signaturePayload}${apiSecret}`).digest("hex");
};

export const createCloudinaryUploadSignature = ({ folder }: SignUploadInput) => {
  const { apiKey, apiSecret, cloudName } = parseCloudinaryUrl();
  const timestamp = Math.round(Date.now() / 1000);
  const uploadFolder = folder ?? process.env.CLOUDINARY_FOLDER;
  const paramsToSign: Record<string, string | number> = { timestamp };

  if (uploadFolder) {
    paramsToSign.folder = uploadFolder;
  }

  return {
    apiKey,
    cloudName,
    folder: uploadFolder,
    signature: signParams(paramsToSign, apiSecret),
    timestamp,
  };
};
