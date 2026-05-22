import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import request from "../api";
import { BACKEND_URLS } from "../constants";
import type { AddClientSchemaType } from "../schema";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ApiError = {
  message?: string;
};

export type Client = {
  id: string;
  businessId: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const clientsQueryKey = (businessId?: string) => ["clients", businessId];

const toClientPayload = (businessId: string, data: AddClientSchemaType) => ({
  ...data,
  businessId,
  email: data.email || null,
  phone: data.phone || null,
  address: data.address || null,
  city: data.city || null,
  country: data.country || null,
});

const getErrorMessage = (error: AxiosError<ApiError>, fallback: string) =>
  error.response?.data?.message ?? fallback;

export const useClients = (businessId?: string) => {
  return useQuery<Client[]>({
    queryKey: clientsQueryKey(businessId),
    enabled: Boolean(businessId),
    queryFn: async () => {
      const response = await request.get<ApiEnvelope<Client[]>>(BACKEND_URLS.CLIENTS, {
        params: { businessId },
      });
      return response.data.data;
    },
  });
};

export const useCreateClient = (options?: { onSuccess?: (client: Client) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiEnvelope<Client>>,
    AxiosError<ApiError>,
    { businessId: string; data: AddClientSchemaType }
  >({
    mutationFn: ({ businessId, data }) => request.post(BACKEND_URLS.CLIENTS, toClientPayload(businessId, data)),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: clientsQueryKey(response.data.data.businessId) });
      toast.success("Client added successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to add client."));
    },
  });
};

export const useUpdateClient = (options?: { onSuccess?: (client: Client) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiEnvelope<Client>>,
    AxiosError<ApiError>,
    { id: string; businessId: string; data: AddClientSchemaType }
  >({
    mutationFn: ({ id, data }) => request.put(`${BACKEND_URLS.CLIENTS}/${id}`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: clientsQueryKey(response.data.data.businessId) });
      toast.success("Client updated successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update client."));
    },
  });
};

export const useDeleteClient = (options?: { onSuccess?: (client: Client) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiEnvelope<Client>>, AxiosError<ApiError>, string>({
    mutationFn: (id) => request.delete(`${BACKEND_URLS.CLIENTS}/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: clientsQueryKey(response.data.data.businessId) });
      toast.success("Client deleted successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to delete client."));
    },
  });
};
