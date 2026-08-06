import { motion } from "framer-motion";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";
import { timeAgo } from "@/utils/formatters";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const gradientByTitle = [
  "from-brand-400 to-violet-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-sky-400 to-indigo-500",
];

function titleGradient(title: string): string {
  let hash = 0;
  for (let index = 0; index < title.length; index += 1) {
    hash = (hash << 5) - hash + title.charCodeAt(index);
    hash |= 0;
  }
  return gradientByTitle[Math.abs(hash) % gradientByTitle.length];
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card group flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10">
        <Link to={`/blueprints/${project.id}`} className="block flex-1">
          <div className="flex items-start gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${titleGradient(project.title)}`}
            >
              <span className="text-sm font-bold">
                {project.title.slice(0, 1).toUpperCase()}
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-500 dark:text-slate-100 dark:group-hover:text-brand-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-ink/45 dark:text-white/45">
                Updated {timeAgo(project.updated_at)}
              </p>
            </div>
          </div>

          <p className="mt-3 line-clamp-3 text-sm text-ink/55 dark:text-white/50">
            {project.description || "No description added yet."}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 dark:border-white/10">
          <Link
            to={`/blueprints/${project.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-400"
          >
            <Badge variant="brand">View Blueprint</Badge>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="cursor-pointer rounded-lg p-2 text-ink/45 transition-colors hover:bg-ink/[0.05] hover:text-ink dark:text-white/45 dark:hover:bg-white/[0.08] dark:hover:text-white"
              aria-label="Edit project"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              className="cursor-pointer rounded-lg p-2 text-ink/45 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-white/45"
              aria-label="Delete project"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}