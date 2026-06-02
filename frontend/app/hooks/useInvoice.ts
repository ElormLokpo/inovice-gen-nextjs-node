import { useMutation, useQueryClient,  useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import request from "../api";
import { BACKEND_URLS } from "../constants";
import {IInvoice, ApiEnvelope, ApiError } from "../types";



const InvoiceQueryKey = ["invoices"];

// const toInvoicePayload = (data: Invoice) => ({
//   ...data,
//   issueDate: data.issueDate?.toISOString() ?? null,
//   dueDate: data.dueDate?.toISOString() ?? null,
// });

const getErrorMessage = (error: AxiosError<ApiError>, fallback: string) =>
  error.response?.data?.message ?? fallback;

export const useInvoices = () => {
  return useQuery<IInvoice[]>({
    queryKey: InvoiceQueryKey,
    queryFn: async () => {
      const response = await request.get<ApiEnvelope<IInvoice[]>>(BACKEND_URLS.INOVICES);
      return response.data.data;
    },
  });
};

export const useCreateInvoice = (options?: { onSuccess?: (Invoice: IInvoice) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiEnvelope<IInvoice>>, AxiosError<ApiError>>({
    mutationFn: (data) => request.post(BACKEND_URLS.INOVICES, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: InvoiceQueryKey });
      toast.success("Invoice added successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to add Invoice."));
    },
  });
};

