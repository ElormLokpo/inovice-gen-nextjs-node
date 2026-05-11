import { useMutation } from "@tanstack/react-query";
import request from "@/app/api";
import { BACKEND_URLS, FRONTEND_URLS } from "@/app/constants";
import { LoginSchemaType } from "../schema";
import { toast } from "sonner";
import { decodeJwt } from "../utils/jwt.decode";
import { useAuthStore } from "../store";
import { useRouter } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";

export const useLogin = () => {
    // eslint-disable-next-line
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  return useMutation<AxiosResponse<string>, AxiosError<any>, LoginSchemaType>({
    mutationFn: (data) => request.post(BACKEND_URLS.LOGIN, data),
    
    onSuccess: (response) => {
    
      toast.success("Login successful");

     
      const token = response.data;
      
      if (token) {
        
        const decoded = decodeJwt(token);
        
      
        setUser({
          fullName: decoded.fullName,
          id: decoded.id,
          role: decoded.role,
          email: decoded.email
        });
        
        setToken(token);

      
        router.push(FRONTEND_URLS.CREATE_INVOICE);
      }
    },
    
    onError: (error) => {
    
      const message = (error.response?.data as any)?.message || "Login failed. Please check your credentials.";
      toast.error(message);
      console.error("Login Error:", error);
    }
  });
};

export const useRegister = () => {
    // eslint-disable-next-line
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  return useMutation<AxiosResponse<string>, AxiosError<any>, RegisterSchemaType>({
    mutationFn: (data) => request.post(BACKEND_URLS.REGISTER, data),
    
    onSuccess: (response) => {
    
      toast.success("Register successful");

     
      const token = response.data;
      
      if (token) {
        
        const decoded = decodeJwt(token);
        
      
        setUser({
          fullName: decoded.fullName,
          id: decoded.id,
          role: decoded.role,
          email: decoded.email
        });
        
        setToken(token);

      
        router.push(FRONTEND_URLS.CREATE_INVOICE);
      }
    },
    
    onError: (error) => {
    
      const message = (error.response?.data as any)?.message || "Register failed. Please try again.";
      toast.error(message);
      console.error("Register Error:", error);
    }
  });
};