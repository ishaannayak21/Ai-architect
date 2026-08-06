import {
  loginRequest,
  registerRequest,
} from "@/api/auth";
import { getCurrentUserRequest, updateUserRequest } from "@/api/users";
import type {
  LoginPayload,
  RegisterPayload,
  UpdateUserPayload,
  User,
} from "@/types";

export function login(payload: LoginPayload) {
  return loginRequest(payload);
}

export function register(payload: RegisterPayload) {
  return registerRequest(payload);
}

export function getCurrentUser(): Promise<User> {
  return getCurrentUserRequest();
}

export function updateProfile(payload: UpdateUserPayload): Promise<User> {
  return updateUserRequest(payload);
}
