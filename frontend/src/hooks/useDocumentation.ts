import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentationService } from "@/services/documentation.service";
import type { Documentation } from "@/types";

export function useDocumentation(blueprintId: number | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ["documentation", blueprintId];

  const { data, isLoading, isError, error, refetch } = useQuery<Documentation>({
    queryKey,
    queryFn: () => {
      if (!blueprintId) throw new Error("Blueprint ID required");
      return documentationService.getDocumentation(blueprintId);
    },
    enabled: Boolean(blueprintId),
    staleTime: Infinity,
  });

  const regenerateMutation = useMutation<Documentation, Error, void>({
    mutationFn: () => {
      if (!blueprintId) throw new Error("Blueprint ID required");
      return documentationService.regenerateDocumentation(blueprintId);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    regenerate: regenerateMutation.mutateAsync,
    isRegenerating: regenerateMutation.isPending,
  };
}
