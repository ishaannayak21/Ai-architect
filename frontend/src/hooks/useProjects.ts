import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as projectsService from "@/services/projects.service";
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/types";

export function useProjects() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.listProjects,
  });

  const createProject = useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectsService.createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProjectPayload }) =>
      projectsService.updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    createProject: createProject.mutateAsync,
    updateProject: updateProject.mutateAsync,
    deleteProject: deleteProject.mutateAsync,
    isCreating: createProject.isPending,
    isUpdating: updateProject.isPending,
    isDeleting: deleteProject.isPending,
  };
}
