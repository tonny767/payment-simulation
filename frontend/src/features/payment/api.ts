import { api } from "@/shared/api/axios";
import type { PaymentsResponse, PaymentsParams } from "./types";

export const fetchPayments = async (params: PaymentsParams): Promise<PaymentsResponse> => {
  const res = await api.get("/payments", { params });
  return res;
};
