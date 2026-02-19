import { api } from "@/shared/api/axios";
import type { LoginRequest, LoginResponse } from "./types";

export const loginRequest = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};
