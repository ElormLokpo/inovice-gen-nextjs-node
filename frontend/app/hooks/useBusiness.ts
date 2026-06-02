import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import request from "../api";
import { BACKEND_URLS } from "../constants";
import type { AddBusinessSchemaType } from "../schema";
import { Business, ApiEnvelope, ApiError } from "../types";


const businessQueryKey = ["businesses"];

const toBusinessPayload = (data: AddBusinessSchemaType) => ({
  ...data,
  logoUrl: data.logoUrl || null,
  email: data.email || null,
  phone: data.phone || null,
  address: data.address || null,
  city: data.city || null,
  country: data.country || null,
  taxId: data.taxId || null,
});

const getErrorMessage = (error: AxiosError<ApiError>, fallback: string) =>
  error.response?.data?.message ?? fallback;

export const useBusinesses = () => {
  return useQuery<Business[]>({
    queryKey: businessQueryKey,
    queryFn: async () => {
      const response = await request.get<ApiEnvelope<Business[]>>(BACKEND_URLS.BUSINESSES);
      return response.data.data;
    },
  });
};

export const useCreateBusiness = (options?: { onSuccess?: (business: Business) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiEnvelope<Business>>, AxiosError<ApiError>, AddBusinessSchemaType>({
    mutationFn: (data) => request.post(BACKEND_URLS.BUSINESSES, toBusinessPayload(data)),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: businessQueryKey });
      toast.success("Business added successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to add business."));
    },
  });
};

export const useUpdateBusiness = (options?: { onSuccess?: (business: Business) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiEnvelope<Business>>,
    AxiosError<ApiError>,
    { id: string; data: AddBusinessSchemaType }
  >({
    mutationFn: ({ id, data }) => request.put(`${BACKEND_URLS.BUSINESSES}/${id}`, toBusinessPayload(data)),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: businessQueryKey });
      toast.success("Business updated successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update business."));
    },
  });
};

export const useDeleteBusiness = (options?: { onSuccess?: (business: Business) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiEnvelope<Business>>, AxiosError<ApiError>, string>({
    mutationFn: (id) => request.delete(`${BACKEND_URLS.BUSINESSES}/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: businessQueryKey });
      toast.success("Business deleted successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to delete business."));
    },
  });
};
