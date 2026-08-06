import { apiClient } from "@/api/client";
import type { Diagram, DiagramType } from "@/types";

export async function listDiagramsRequest(
  blueprintId: number,
): Promise<Diagram[]> {
  const { data } = await apiClient.get<Diagram[]>(
    `/blueprints/${blueprintId}/diagrams`,
  );
  return data;
}

export async function generateDiagramsRequest(
  blueprintId: number,
): Promise<Diagram[]> {
  const { data } = await apiClient.post<Diagram[]>(
    `/blueprints/${blueprintId}/diagrams`,
    null,
    { timeout: 240_000 },
  );
  return data;
}

export async function regenerateDiagramRequest(
  blueprintId: number,
  diagramType: DiagramType,
): Promise<Diagram> {
  const { data } = await apiClient.post<Diagram>(
    `/blueprints/${blueprintId}/diagrams/${diagramType}/regenerate`,
    null,
    { timeout: 240_000 },
  );
  return data;
}