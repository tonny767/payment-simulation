import { api } from "@/shared/api/axios";
import type { PaymentsResponse, PaymentsParams, PaymentSummary } from "./types";

export const fetchPayments = async (params: PaymentsParams): Promise<PaymentsResponse> => {
  const res = await api.get("/payments", { params });
  return res.data;
};

export const fetchPaymentSummary = async (): Promise<PaymentSummary> => {
  const res = await api.get("/payments/summary");
  return res.data;
};
