import { AnimatePresence } from "framer-motion";
import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProjects } from "@/hooks/useProjects";
import type { CreateProjectPayload, Project } from "@/types";
import { getApiErrorMessage } from "@/utils/errors";

export function ProjectsPage() {
  const {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProjects();

  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditing(null);
      setDialogOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: CreateProjectPayload) => {
    if (editing) {
      await updateProject({ id: editing.id, payload: values });
      toast.success("Project updated");
    } else {
      await createProject(values);
      toast.success("Project created");
    }
  };

  const handleSubmitError = (error: unknown) => {
    toast.error(getApiErrorMessage(error, "Could not save project"));
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return Promise.resolve();
    }
    try {
      await deleteProject(deleteTarget.id);
      toast.success("Project deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete project"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
            {projects.length} project{projects.length === 1 ? "" : "s"} in your
            workspace
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4.5" />
          New project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="size-6" />}
          title="No projects yet"
          description="Create your first project to start turning your idea into a complete engineering blueprint."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={openEdit}
                onDelete={(p) => setDeleteTarget(p)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={editing}
        submitting={isCreating || isUpdating}
        onSubmit={(values) => handleSubmit(values).catch(handleSubmitError)}
      />

      <DeleteProjectDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        project={deleteTarget}
        submitting={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}