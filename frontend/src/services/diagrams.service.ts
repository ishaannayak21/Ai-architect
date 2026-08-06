import {
  generateDiagramsRequest,
  listDiagramsRequest,
  regenerateDiagramRequest,
} from "@/api/diagrams";
import type { Diagram, DiagramType } from "@/types";

export function listDiagrams(blueprintId: number): Promise<Diagram[]> {
  return listDiagramsRequest(blueprintId);
}

export function generateDiagrams(blueprintId: number): Promise<Diagram[]> {
  return generateDiagramsRequest(blueprintId);
}

export function regenerateDiagram(
  blueprintId: number,
  diagramType: DiagramType,
): Promise<Diagram> {
  return regenerateDiagramRequest(blueprintId, diagramType);
}