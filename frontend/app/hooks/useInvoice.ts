import { useMutation, useQueryClient,  useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { toast } from "sonner";
import request from "../api";
import { BACKEND_URLS } from "../constants";
import {IInvoice, ApiEnvelope, ICreateInvoiceData, ApiError } from "../types";


const InvoiceQueryKey = ["invoices"];

const sumInvoiceItems = (data: ICreateInvoiceData) =>
  data.invoiceItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);

const toInvoicePayload = (data: ICreateInvoiceData) => {
  const subtotal = data.subtotal ?? data.total ?? sumInvoiceItems(data);
  const taxTotal =
    (data.nhilAmount ?? 0) +
    (data.getfundAmount ?? 0) +
    (data.covidAmount ?? 0) +
    (data.vatAmount ?? 0);

  return {
    ...data,
    clientEmail: data.clientEmail ?? data.clientDetails.email,
    items: data.items ?? data.invoiceItems,
    subtotal,
    totalAmount: data.totalAmount ?? subtotal + taxTotal,
  };
};


export const useInvoices = () => {
  return useQuery<IInvoice[]>({
    queryKey: InvoiceQueryKey,
    queryFn: async () => {
      const response = await request.get<ApiEnvelope<IInvoice[]>>(BACKEND_URLS.INVOICES);
      return response.data.data;
    },
  });
};

export const useCreateInvoice = (options?: { onSuccess?: (Invoice: IInvoice) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data:ICreateInvoiceData) =>
      request.post<ApiEnvelope<IInvoice>>(BACKEND_URLS.INVOICES, toInvoicePayload(data)),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: InvoiceQueryKey });
      toast.success("Invoice generated successfully");
      options?.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      const requestError = error as AxiosError<ApiError>;
      toast.error(requestError.response?.data?.message ?? "Unable to generate invoice.");
    },
  });
};

