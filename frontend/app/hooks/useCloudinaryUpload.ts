import { useMutation } from "@tanstack/react-query";
import request from "../api";
import { BACKEND_URLS } from "../constants";
import { ApiEnvelope} from "../types";

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  original_filename: string;
};

type CloudinarySignatureResponse = {
  apiKey: string;
  cloudName: string;
  folder?: string;
  signature: string;
  timestamp: number;
};


type UploadFileOptions = {
  file: File;
  folder?: string;
};

const defaultFolder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

const uploadFileToCloudinary = async ({ file, folder = defaultFolder }: UploadFileOptions) => {
  const signatureResponse = await request.post<ApiEnvelope<CloudinarySignatureResponse>>(
    BACKEND_URLS.CLOUDINARY_SIGNATURE,
    { folder },
  );
  const { apiKey, cloudName, signature, timestamp, folder: signedFolder } = signatureResponse.data.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);
  formData.append("timestamp", String(timestamp));

  if (signedFolder) {
    formData.append("folder", signedFolder);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Unable to upload file to Cloudinary.");
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  return data.secure_url;
};

export const useCloudinaryUpload = () => {
  return useMutation<string, Error, UploadFileOptions>({
    mutationFn: uploadFileToCloudinary,
  });
};
