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

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
    >
      <div className="retro-card group flex h-full flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#C05621]/40">
        <Link to={`/blueprints/${project.id}`} className="block flex-1">
          <div className="flex items-start gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C5D8C9] bg-[#E8F0EA] font-serif text-base font-bold text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7]">
              {project.title.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-serif text-lg font-bold text-[#1F2421] transition-colors group-hover:text-[#C05621] dark:text-[#E6ECE7] dark:group-hover:text-[#E07A48]">
                {project.title}
              </h3>
              <p className="font-mono text-[11px] text-[#6B726C] dark:text-[#A3B5A7]">
                Updated {timeAgo(project.updated_at)}
              </p>
            </div>
          </div>

          <p className="mt-3.5 line-clamp-3 font-sans text-sm text-[#4A524C] dark:text-[#A3B5A7] leading-relaxed">
            {project.description || "No description added yet."}
          </p>
        </Link>

        <div className="mt-5 flex items-center justify-between border-t border-[#E6DFD5] pt-3.5 dark:border-[#2B3D2F]">
          <Link
            to={`/blueprints/${project.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C05621] hover:text-[#A8481A] dark:text-[#E07A48]"
          >
            <Badge variant="brand">View Blueprint</Badge>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="cursor-pointer rounded-lg p-2 text-[#6B726C] transition-colors hover:bg-[#F2ECE1] hover:text-[#1F2421] dark:text-[#A3B5A7] dark:hover:bg-[#243226] dark:hover:text-white"
              aria-label="Edit project"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              className="cursor-pointer rounded-lg p-2 text-[#6B726C] transition-colors hover:bg-[#FDF3EE] hover:text-[#C05621] dark:text-[#A3B5A7] dark:hover:bg-[#331C13] dark:hover:text-[#E07A48]"
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