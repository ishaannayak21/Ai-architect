import { apiClient } from "@/api/client";
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from "@/types";

export async function listProjectsRequest(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>("/projects");
  return data;
}

export async function getProjectRequest(projectId: number): Promise<Project> {
  const { data } = await apiClient.get<Project>(`/projects/${projectId}`);
  return data;
}

export async function createProjectRequest(
  payload: CreateProjectPayload,
): Promise<Project> {
  const { data } = await apiClient.post<Project>("/projects", payload);
  return data;
}

export async function updateProjectRequest(
  projectId: number,
  payload: UpdateProjectPayload,
): Promise<Project> {
  const { data } = await apiClient.patch<Project>(
    `/projects/${projectId}`,
    payload,
  );
  return data;
}

export async function deleteProjectRequest(projectId: number): Promise<void> {
  await apiClient.delete(`/projects/${projectId}`);
}
