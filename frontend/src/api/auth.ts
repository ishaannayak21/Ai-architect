import { apiClient } from "@/api/client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}
