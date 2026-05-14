import { useMutation } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import request from "@/app/api";
import { BACKEND_URLS, FRONTEND_URLS } from "@/app/constants";
import {
  ForgotPasswordSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
  ResetPasswordSchemaType,
} from "../schema";
import { useAuthStore, type IUserData } from "../store";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type LoginData = {
  token: string;
  user: IUserData;
};

type MessageData = {
  message: string;
};

type ApiError = {
  message?: string;
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation<AxiosResponse<ApiEnvelope<LoginData>>, AxiosError<ApiError>, LoginSchemaType>({
    mutationFn: (data) => request.post(BACKEND_URLS.LOGIN, data),
    onSuccess: (response) => {
      const { token, user } = response.data.data;

      setAuth({ token, user });
      toast.success("Login successful");
      router.push(FRONTEND_URLS.CREATE_INVOICE);
    },
    onError: () => {
      toast.error( "Login failed. Please check your credentials.");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation<AxiosResponse<ApiEnvelope<MessageData>>, AxiosError<ApiError>, RegisterSchemaType>({
    mutationFn: (data) => request.post(BACKEND_URLS.REGISTER, data),
    onSuccess: (_response, variables) => {
      toast.success("Account created successfully");
      router.push(`${FRONTEND_URLS.CONFIRM_EMAIL}?email=${encodeURIComponent(variables.email)}`);
    },
    onError: () => {
      toast.error( "Register failed. Please try again.");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<AxiosResponse<ApiEnvelope<MessageData>>, AxiosError<ApiError>, ForgotPasswordSchemaType>({
    mutationFn: (data) => request.post(BACKEND_URLS.FORGOT_PASSWORD, data),
    onSuccess: () => {
      toast.success("Password reset link sent successfully");
    },
    onError: () => {
      toast.error( "Unable to send reset link.");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation<AxiosResponse<ApiEnvelope<IUserData>>, AxiosError<ApiError>, ResetPasswordSchemaType>({
    mutationFn: ({ token, password }) => request.post(BACKEND_URLS.RESET_PASSWORD, { token, password }),
    onSuccess: () => {
      toast.success("Password reset successful. You can sign in now.");
      router.push(FRONTEND_URLS.LOGIN);
    },
    onError: () => {
      toast.error("Unable to reset password.");
    },
  });
};

export const useConfirmEmail = () => {
  const router = useRouter();

  return useMutation<AxiosResponse<ApiEnvelope<IUserData>>, AxiosError<ApiError>, string>({
    mutationFn: (token) => request.post(BACKEND_URLS.CONFIRM_EMAIL, { token }),
    onSuccess: () => {
      toast.success("Email confirmed. You can sign in now.");
      router.push(FRONTEND_URLS.LOGIN);
    },
    onError: () => {
      toast.error("Unable to confirm email.");
    },
  });
};

export const useResendConfirmation = () => {
  return useMutation<AxiosResponse<ApiEnvelope<MessageData>>, AxiosError<ApiError>, { email: string }>({
    mutationFn: (data) => request.post(BACKEND_URLS.RESEND_CONFIRMATION, data),
    onSuccess: (response) => {
      toast.success(response.data.data.message);
    },
    onError: () => {
      toast.error("Unable to resend confirmation email.");
    },
  });
};
