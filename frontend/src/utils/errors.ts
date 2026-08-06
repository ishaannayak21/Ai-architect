import { AxiosError } from "axios";

interface ApiErrorDetail {
  detail?: string | Array<{ msg?: string }>;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorDetail;
    if (typeof data.detail === "string" && data.detail.length > 0) {
      return data.detail;
    }
    if (Array.isArray(data.detail) && data.detail[0]?.msg) {
      return data.detail[0].msg;
    }
  }
  return fallback;
}
