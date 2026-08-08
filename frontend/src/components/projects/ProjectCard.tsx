import { motion } from "framer-motion";
import { ExternalLink, Layers, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { Project } from "@/types";
import { timeAgo } from "@/utils/formatters";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  // Extract tech stack badge text if available or fallback based on title/description
  const techTag = project.description?.toLowerCase().includes("python")
    ? "PYTHON"
    : project.description?.toLowerCase().includes("next")
      ? "NEXT.JS"
      : "REACT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative h-full"
    >
      <div className="flex h-full flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-200 hover:border-stone-300 dark:border-stone-800/80 dark:bg-[#111111] dark:hover:border-stone-700">
        <Link to={`/blueprints/${project.id}`} data-cursor-label="Open Project" className="block">
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-500">
              <Layers className="size-5" />
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(project);
                }}
                className="opacity-0 group-hover:opacity-100 cursor-pointer rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white transition-all"
                title="Edit project"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(project);
                }}
                className="opacity-0 group-hover:opacity-100 cursor-pointer rounded-lg p-1.5 text-stone-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                title="Delete project"
              >
                <Trash2 className="size-3.5" />
              </button>
              <span className="flex size-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition-colors group-hover:border-stone-400 group-hover:text-stone-900 dark:border-stone-800 dark:text-stone-400 dark:group-hover:border-stone-600 dark:group-hover:text-white">
                <ExternalLink className="size-4" />
              </span>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="font-sans text-lg font-bold text-stone-900 transition-colors group-hover:text-orange-500 dark:text-white">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {project.description || "Complete software architecture blueprint."}
            </p>
          </div>
        </Link>

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4 dark:border-stone-800/80">
          <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
            Updated {timeAgo(project.updated_at)}
          </span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              {techTag}
            </span>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}