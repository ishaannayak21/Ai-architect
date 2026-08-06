import {
  exportDocumentationUrl,
  getDocumentationApi,
  regenerateDocumentationApi,
} from "@/api/documentation";
import type { Documentation } from "@/types";

export const documentationService = {
  getDocumentation: (blueprintId: number): Promise<Documentation> =>
    getDocumentationApi(blueprintId),
  regenerateDocumentation: (blueprintId: number): Promise<Documentation> =>
    regenerateDocumentationApi(blueprintId),
  getExportUrl: (blueprintId: number, format: "markdown" | "html" | "pdf"): string =>
    exportDocumentationUrl(blueprintId, format),
};
