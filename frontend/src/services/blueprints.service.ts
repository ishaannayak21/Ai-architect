import {
  generateBlueprintRequest,
  getBlueprintRequest,
  listBlueprintsRequest,
} from "@/api/blueprints";
import type {
  Blueprint,
  GenerateBlueprintPayload,
} from "@/types";

export function generateBlueprint(
  payload: GenerateBlueprintPayload,
): Promise<Blueprint> {
  return generateBlueprintRequest(payload);
}

export function listBlueprints(): Promise<Blueprint[]> {
  return listBlueprintsRequest();
}

export function getBlueprint(blueprintId: number): Promise<Blueprint> {
  return getBlueprintRequest(blueprintId);
}
