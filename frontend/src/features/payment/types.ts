export type Payment = {
  id: string;
  amount: number;
  status: "success" | "processing" | "failed";
  merchant: string;
  created_at: string;
};

export type PaymentsResponse = {
  payments: Payment[];
  total: number;
};
export type PaymentSummary = {
  completed: number;
  failed: number;
  processing: number;
  total: number;
  total_amount: number;
};
export type PaymentsParams = {
  status?: "completed" | "processing" | "failed";
  sort?: string; // example: "-amount,created_at"
  page?: number;
  limit?: number;
};
