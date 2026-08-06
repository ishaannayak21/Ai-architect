import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as diagramsService from "@/services/diagrams.service";
import type { DiagramType, DiagramsByType } from "@/types";

export function useDiagrams(blueprintId: number | undefined) {
  const queryClient = useQueryClient();
  const enabled = blueprintId !== undefined && blueprintId !== null;

  const listQuery = useQuery({
    queryKey: ["blueprints", blueprintId, "diagrams"],
    queryFn: () => diagramsService.listDiagrams(blueprintId as number),
    enabled,
  });

  const generateAll = useMutation({
    mutationFn: () => diagramsService.generateDiagrams(blueprintId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blueprints", blueprintId, "diagrams"],
      });
    },
  });

  const regenerate = useMutation({
    mutationFn: (diagramType: DiagramType) =>
      diagramsService.regenerateDiagram(blueprintId as number, diagramType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blueprints", blueprintId, "diagrams"],
      });
    },
  });

  const diagrams = listQuery.data ?? [];

  const byType: DiagramsByType = useMemo(() => {
    const map: DiagramsByType = {};
    for (const diagram of diagrams) {
      map[diagram.diagram_type] = diagram;
    }
    return map;
  }, [diagrams]);

  return {
    diagrams,
    byType,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    generateAll: generateAll.mutateAsync,
    isGeneratingAll: generateAll.isPending,
    regenerate: regenerate.mutateAsync,
    isRegeneratingAll: regenerate.isPending,
  };
}