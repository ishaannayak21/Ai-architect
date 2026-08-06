import axios, { AxiosError } from "axios";

import { API_URL, ROUTES } from "@/constants";
import { clearToken, getToken } from "@/utils/storage";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const token = getToken();
      if (token) {
        clearToken();
        if (window.location.pathname !== ROUTES.LOGIN) {
          window.location.assign(ROUTES.LOGIN);
        }
      }
    }
    return Promise.reject(error);
  },
);
