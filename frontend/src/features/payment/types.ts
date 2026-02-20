export type Payment = {
  id: string;
  amount: number;
  status: "success" | "processing" | "failed";
  merchant: string;
  created_at: string;
};

export type PaymentsResponse = {
  data: {
    payments: Payment[];
  };
};
export type PaymentsParams = {
  status?: "completed" | "processing" | "failed";
  sort?: string; // example: "-amount,created_at"
};
