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
        className="glass-card group flex h-full w-full cursor-pointer flex-col rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 text-white">
            <Layers className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{blueprint.title}</h3>
            <p className="flex items-center gap-1.5 text-xs text-ink/45 dark:text-white/45">
              <CalendarDays className="size-3.5" />
              Generated {formatDate(blueprint.created_at)}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 flex-1 text-sm text-ink/55 dark:text-white/50">
          {data.project_summary || blueprint.description || "No summary available."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3 dark:border-white/10">
          <Badge variant="brand">{stackCount} tech</Badge>
          <Badge variant="neutral">{tableCount} tables</Badge>
          {teamSize ? (
            <Badge variant="neutral">
              <Users className="size-3" />
              {teamSize}
            </Badge>
          ) : null}
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-brand-500 opacity-0 transition-opacity group-hover:opacity-100">
            Open blueprint <ArrowRight className="size-3.5" />
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
          <h2 className="text-2xl font-bold tracking-tight">Project History</h2>
          <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
            {blueprints.length} generated blueprint
            {blueprints.length === 1 ? "" : "s"} saved in your workspace
          </p>
        </div>
        <Link to={ROUTES.NEW_PROJECT}>
          <Button>
            <Plus className="size-4.5" />
            New project
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
