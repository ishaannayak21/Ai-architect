import { motion } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  FolderKanban,
  Layers,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { DashboardMarquee } from "@/components/layout/DashboardMarquee";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants";
import { useBlueprints } from "@/hooks/useBlueprints";
import type { Blueprint } from "@/types";
import { formatDate } from "@/utils/formatters";

const ACCENT_COLORS = [
  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
  { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
];

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
  const teamSize = data?.estimated_team_size;
  const stackCount = data?.recommended_tech_stack?.length ?? 0;
  const tableCount = data?.database_tables?.length ?? 0;

  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
    >
      <div
        onClick={() => onOpen(blueprint)}
        className="group flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-stone-300 dark:border-stone-800/80 dark:bg-[#111111] dark:hover:border-stone-700 shadow-xs"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent.bg} ${accent.text} ${accent.border}`}>
                <Layers className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-sans text-base font-bold text-stone-900 transition-colors group-hover:text-orange-500 dark:text-white dark:group-hover:text-orange-500">
                  {blueprint.title}
                </h3>
                <p className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  <CalendarDays className="size-3" />
                  Generated {formatDate(blueprint.created_at)}
                </p>
              </div>
            </div>

            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-colors group-hover:border-stone-400 group-hover:text-stone-900 dark:border-stone-800 dark:text-stone-400 dark:group-hover:border-stone-600 dark:group-hover:text-white">
              <ExternalLink className="size-3.5" />
            </span>
          </div>

          {/* Description Summary */}
          <p className="mt-4 line-clamp-2 font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {data?.project_summary || blueprint.description || "Interactive AI-generated architecture blueprint."}
          </p>
        </div>

        {/* Metadata Footer Pills */}
        <div className="mt-6 border-t border-stone-200 pt-4 dark:border-stone-800/80">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold text-stone-700 dark:border-stone-800 dark:bg-[#181818] dark:text-stone-300">
              {stackCount} Tech
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold text-stone-700 dark:border-stone-800 dark:bg-[#181818] dark:text-stone-300">
              {tableCount} Tables
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold text-stone-700 dark:border-stone-800 dark:bg-[#181818] dark:text-stone-300 flex items-center gap-1">
              <Users className="size-3 text-stone-400" />
              {teamSize ? teamSize : "2–4 engineers"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function BlueprintHistoryPage() {
  const { blueprints, isLoading, isError, refetch } = useBlueprints();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [filterType, setFilterType] = useState<"all" | "db" | "api">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const openBlueprint = (blueprint: Blueprint) =>
    navigate(`/blueprints/${blueprint.id}`);

  // Client-side filtering & sorting on real cached DB blueprints (0 AI calls)
  const filteredBlueprints = useMemo(() => {
    let list = [...blueprints];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.data?.project_summary?.toLowerCase().includes(q),
      );
    }

    if (filterType === "db") {
      list = list.filter((b) => (b.data?.database_tables?.length ?? 0) > 0);
    } else if (filterType === "api") {
      list = list.filter((b) => (b.data?.rest_api_endpoints?.length ?? 0) > 0);
    }

    if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [blueprints, searchQuery, sortBy, filterType]);

  const totalPages = Math.ceil(filteredBlueprints.length / ITEMS_PER_PAGE) || 1;
  const currentBlueprints = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBlueprints.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBlueprints, currentPage]);

  const startIndex = filteredBlueprints.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredBlueprints.length);

  return (
    <div className="space-y-8">
      {/* Top Feature Marquee directly below Header */}
      <DashboardMarquee />

      {/* Main Page Title Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl font-normal tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            Project History
          </h2>
          <p className="mt-2 font-mono text-sm text-stone-600 dark:text-stone-400">
            <span className="font-bold text-orange-500">{blueprints.length}</span>{" "}
            generated blueprint{blueprints.length === 1 ? "" : "s"} saved in your workspace
          </p>
        </div>

        <Link to={ROUTES.NEW_PROJECT}>
          <Button className="rounded-xl bg-orange-600 px-5 py-2.5 font-sans font-bold text-sm text-white hover:bg-orange-500">
            <Plus className="size-4.5" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Search / Sort / Filter Controls matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 font-sans text-sm text-stone-900 outline-none transition-colors focus:border-orange-500 dark:border-stone-800 dark:bg-[#111111] dark:text-white dark:focus:border-orange-500"
          />
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 dark:border-stone-800 dark:bg-[#111111]">
            <Calendar className="size-4 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
              className="bg-transparent font-mono text-xs font-bold text-stone-800 outline-none dark:text-stone-200 cursor-pointer"
            >
              <option value="newest" className="dark:bg-[#181818]">Sort by: Newest</option>
              <option value="oldest" className="dark:bg-[#181818]">Sort by: Oldest</option>
              <option value="name" className="dark:bg-[#181818]">Sort by: Name</option>
            </select>
          </div>

          <div className="relative flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 dark:border-stone-800 dark:bg-[#111111]">
            <Filter className="size-4 text-stone-400" />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as "all" | "db" | "api");
                setCurrentPage(1);
              }}
              className="bg-transparent font-mono text-xs font-bold text-stone-800 outline-none dark:text-stone-200 cursor-pointer"
            >
              <option value="all" className="dark:bg-[#181818]">All Projects</option>
              <option value="db" className="dark:bg-[#181818]">With Database</option>
              <option value="api" className="dark:bg-[#181818]">With API Contracts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<FolderKanban className="size-6 text-orange-500" />}
          title="Couldn't load your history"
          description="Something went wrong while fetching your blueprints from the database."
          action={
            <Button variant="secondary" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : blueprints.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="size-6 text-orange-500" />}
          title="No architecture projects yet"
          description="Create your first blueprint to get started."
          action={
            <Link to={ROUTES.NEW_PROJECT}>
              <Button className="rounded-full bg-orange-600 text-white px-6">
                <Plus className="size-4" />
                New Architect Design
              </Button>
            </Link>
          }
        />
      ) : currentBlueprints.length === 0 ? (
        <EmptyState
          icon={<Search className="size-6 text-orange-500" />}
          title="No matching projects"
          description={`No projects found matching "${searchQuery}".`}
          action={
            <Button variant="secondary" onClick={() => setSearchQuery("")}>
              Clear search filter
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {currentBlueprints.map((blueprint, index) => (
            <BlueprintCard
              key={blueprint.id}
              blueprint={blueprint}
              onOpen={openBlueprint}
              index={(currentPage - 1) * ITEMS_PER_PAGE + index}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar matching reference screenshot */}
      {filteredBlueprints.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row border-t border-stone-200 dark:border-stone-800/80">
          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 disabled:opacity-40 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-[#111111] dark:text-stone-400 dark:hover:bg-[#181818]"
            >
              <ChevronLeft className="size-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex size-9 cursor-pointer items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${
                    isActive
                      ? "border border-orange-500/50 bg-stone-100 text-orange-500 dark:bg-[#181818] dark:text-orange-500"
                      : "border border-transparent text-stone-500 hover:border-stone-200 hover:bg-stone-100 dark:text-stone-400 dark:hover:border-stone-800 dark:hover:bg-[#111111]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 disabled:opacity-40 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-[#111111] dark:text-stone-400 dark:hover:bg-[#181818]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Showing X of Y count indicator */}
          <div className="font-mono text-xs text-stone-500 dark:text-stone-400">
            Showing {startIndex} to {endIndex} of {filteredBlueprints.length} project
            {filteredBlueprints.length === 1 ? "" : "s"}
          </div>
        </div>
      )}
    </div>
  );
}
