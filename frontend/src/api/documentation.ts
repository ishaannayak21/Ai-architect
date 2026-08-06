import { apiClient } from "@/api/client";
import type { Documentation } from "@/types";

export const getDocumentationApi = async (blueprintId: number): Promise<Documentation> => {
  try {
    const response = await apiClient.get<Documentation>(`/blueprints/${blueprintId}/documentation`);
    return response.data;
  } catch {
    const response = await apiClient.get<Documentation>(`/projects/${blueprintId}/documentation`);
    return response.data;
  }
};

export const regenerateDocumentationApi = async (blueprintId: number): Promise<Documentation> => {
  const response = await apiClient.post<Documentation>(`/blueprints/${blueprintId}/documentation/regenerate`);
  return response.data;
};

export const exportDocumentationUrl = (blueprintId: number, format: "markdown" | "html" | "pdf"): string => {
  const baseUrl = apiClient.defaults.baseURL || "/api/v1";
  return `${baseUrl}/blueprints/${blueprintId}/documentation/export?format=${format}`;
};
