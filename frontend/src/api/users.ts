import { apiClient } from "@/api/client";
import type { UpdateUserPayload, User } from "@/types";

export async function getCurrentUserRequest(): Promise<User> {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
}

export async function updateUserRequest(
  payload: UpdateUserPayload,
): Promise<User> {
  const { data } = await apiClient.patch<User>("/users/me", payload);
  return data;
}
