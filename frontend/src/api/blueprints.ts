import { apiClient } from "@/api/client";
import type {
  Blueprint,
  GenerateBlueprintPayload,
} from "@/types";

export async function generateBlueprintRequest(
  payload: GenerateBlueprintPayload,
): Promise<Blueprint> {
  const { data } = await apiClient.post<Blueprint>(
    "/blueprints/generate",
    payload,
    { timeout: 240_000 },
  );
  return data;
}

export async function listBlueprintsRequest(): Promise<Blueprint[]> {
  const { data } = await apiClient.get<Blueprint[]>("/blueprints");
  return data;
}

export async function getBlueprintRequest(blueprintId: number): Promise<Blueprint> {
  const { data } = await apiClient.get<Blueprint>(`/blueprints/${blueprintId}`);
  return data;
}
