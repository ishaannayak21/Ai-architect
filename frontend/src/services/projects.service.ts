import {
  createProjectRequest,
  deleteProjectRequest,
  listProjectsRequest,
  updateProjectRequest,
} from "@/api/projects";
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from "@/types";

export function listProjects(): Promise<Project[]> {
  return listProjectsRequest();
}

export function createProject(
  payload: CreateProjectPayload,
): Promise<Project> {
  return createProjectRequest(payload);
}

export function updateProject(
  projectId: number,
  payload: UpdateProjectPayload,
): Promise<Project> {
  return updateProjectRequest(projectId, payload);
}

export function deleteProject(projectId: number): Promise<void> {
  return deleteProjectRequest(projectId);
}
