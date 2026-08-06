import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as blueprintsService from "@/services/blueprints.service";
import type { GenerateBlueprintPayload } from "@/types";

export function useBlueprints() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["blueprints"],
    queryFn: blueprintsService.listBlueprints,
  });

  const generate = useMutation({
    mutationFn: (payload: GenerateBlueprintPayload) =>
      blueprintsService.generateBlueprint(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blueprints"] });
    },
  });

  return {
    blueprints: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    generateBlueprint: generate.mutateAsync,
    isGenerating: generate.isPending,
  };
}

export function useBlueprint(blueprintId: number | undefined) {
  return useQuery({
    queryKey: ["blueprints", blueprintId],
    queryFn: () => blueprintsService.getBlueprint(blueprintId as number),
    enabled: blueprintId !== undefined && blueprintId !== null,
  });
}
