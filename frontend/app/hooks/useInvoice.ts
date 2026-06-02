import { useMutation, useQueryClient,  useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import request from "../api";
import { BACKEND_URLS } from "../constants";

interface Invoice {
  id: string;
  businessId: string;
  clientId: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  nhilAmount: number;
  getfundAmount: number;
  covidAmount: number;
  vatAmount: number;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ApiError = {
  message?: string;
};


const InvoiceQueryKey = ["invoices"];

const toInvoicePayload = (data: Invoice) => ({
  ...data,
  issueDate: data.issueDate?.toISOString() ?? null,
  dueDate: data.dueDate?.toISOString() ?? null,
});

const getErrorMessage = (error: AxiosError<ApiError>, fallback: string) =>
  error.response?.data?.message ?? fallback;

export const useInvoices = () => {
  return useQuery<Invoice[]>({
    queryKey: InvoiceQueryKey,
    queryFn: async () => {
      const response = await request.get<ApiEnvelope<Invoice[]>>(BACKEND_URLS.InvoiceES);
      return response.data.data;
    },
  });
};

export const useCreateInvoice = (options?: { onSuccess?: (Invoice: Invoice) => void }) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiEnvelope<Invoice>>, AxiosError<ApiError>, AddInvoiceSchemaType>({
    mutationFn: (data) => request.post(BACKEND_URLS.InvoiceES, toInvoicePayload(data)),
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
