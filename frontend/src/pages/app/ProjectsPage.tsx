import { AnimatePresence } from "framer-motion";
import { FolderKanban, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { DashboardMarquee } from "@/components/layout/DashboardMarquee";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
    );
  }, [projects, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Dynamic Feature Marquee */}
      <DashboardMarquee />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl font-normal tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            Projects
          </h2>
          <p className="mt-2 font-mono text-sm text-stone-600 dark:text-stone-400">
            <span className="font-bold text-orange-500">{projects.length}</span> project
            {projects.length === 1 ? "" : "s"} saved in your workspace
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-xl bg-orange-600 px-5 py-2.5 font-sans font-bold text-sm text-white hover:bg-orange-500">
          <Plus className="size-4.5" />
          New project
        </Button>
      </div>

      {/* Search Input Control */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 font-sans text-sm text-stone-900 outline-none transition-colors focus:border-orange-500 dark:border-stone-800 dark:bg-[#111111] dark:text-white dark:focus:border-orange-500"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="size-6 text-orange-500" />}
          title="No projects found"
          description="Create your first project to start turning your idea into a complete engineering blueprint."
          action={
            <Button onClick={openCreate} className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-6">
              <Plus className="size-4" />
              New project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((project) => (
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