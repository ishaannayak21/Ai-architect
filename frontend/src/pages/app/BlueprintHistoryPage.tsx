import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  FolderKanban,
  Layers,
  Plus,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants";
import { useBlueprints } from "@/hooks/useBlueprints";
import type { Blueprint } from "@/types";
import { formatDate } from "@/utils/formatters";

function BlueprintCard({
  blueprint,
  onOpen,
  index,
}: {
  blueprint: Blueprint;
  onOpen: (blueprint: Blueprint) => void;
  index: number;
}) {
  const { data } = blueprint;
  const teamSize = data.estimated_team_size;
  const stackCount = data.recommended_tech_stack?.length ?? 0;
  const tableCount = data.database_tables?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <button
        type="button"
        onClick={() => onOpen(blueprint)}
        className="retro-card group flex h-full w-full cursor-pointer flex-col rounded-2xl p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#C05621]/40"
      >
        <div className="flex items-start gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C5D8C9] bg-[#E8F0EA] font-bold text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7]">
            <Layers className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-lg font-bold text-[#1F2421] transition-colors group-hover:text-[#C05621] dark:text-[#E6ECE7] dark:group-hover:text-[#E07A48]">
              {blueprint.title}
            </h3>
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B726C] dark:text-[#A3B5A7]">
              <CalendarDays className="size-3.5" />
              Generated {formatDate(blueprint.created_at)}
            </p>
          </div>
        </div>

        <p className="mt-3.5 line-clamp-2 flex-1 font-sans text-sm text-[#4A524C] dark:text-[#A3B5A7] leading-relaxed">
          {data.project_summary || blueprint.description || "No summary available."}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#E6DFD5] pt-3.5 dark:border-[#2B3D2F]">
          <Badge variant="brand">{stackCount} Tech</Badge>
          <Badge variant="neutral">{tableCount} Tables</Badge>
          {teamSize ? (
            <Badge variant="neutral">
              <Users className="size-3" />
              {teamSize}
            </Badge>
          ) : null}
          <span className="ml-auto flex items-center gap-1 font-mono text-xs font-semibold text-[#C05621] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#E07A48]">
            Open <ArrowRight className="size-3.5" />
          </span>
        </div>
      </button>
    </motion.div>
  );
}

export function BlueprintHistoryPage() {
  const { blueprints, isLoading, isError, refetch } = useBlueprints();
  const navigate = useNavigate();

  const openBlueprint = (blueprint: Blueprint) =>
    navigate(`/blueprints/${blueprint.id}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7] sm:text-4xl">Project History</h2>
          <p className="mt-2 font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
            {blueprints.length} generated blueprint
            {blueprints.length === 1 ? "" : "s"} saved in your workspace
          </p>
        </div>
        <Link to={ROUTES.NEW_PROJECT}>
          <Button>
            <Plus className="size-4.5" />
            New Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<FolderKanban className="size-6" />}
          title="Couldn't load your history"
          description="Something went wrong while fetching your blueprints."
          action={
            <Button variant="secondary" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : blueprints.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="size-6" />}
          title="No blueprints yet"
          description="Describe your first application idea and the architect will design a complete engineering blueprint — it will appear here."
          action={
            <Link to={ROUTES.NEW_PROJECT}>
              <Button>
                <Plus className="size-4" />
                Create your first project
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((blueprint, index) => (
            <BlueprintCard
              key={blueprint.id}
              blueprint={blueprint}
              onOpen={openBlueprint}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
