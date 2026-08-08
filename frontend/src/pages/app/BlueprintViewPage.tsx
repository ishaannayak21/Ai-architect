import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  CalendarDays,
  Cloud,
  Database,
  FolderTree,
  ListChecks,
  Route,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ArchitectChatWindow } from "@/components/chat/ArchitectChatWindow";
import { DiagramsSection } from "@/components/diagrams/DiagramsSection";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants";
import { useBlueprint } from "@/hooks/useBlueprints";
import type {
  ArchitectBlueprint,
  BlueprintApiEndpoint,
  BlueprintDatabaseTable,
} from "@/types";
import { formatDate } from "@/utils/formatters";

function SectionCard({
  icon: Icon,
  title,
  children,
  accent = "brand",
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  accent?: "brand" | "emerald" | "violet" | "amber";
}) {
  const accentClasses: Record<string, string> = {
    brand: "border-orange-500/30 bg-orange-500/10 text-orange-500",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    violet: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800/80 dark:bg-[#111111] sm:p-7 shadow-xs">
      <h3 className="flex items-center gap-3 font-serif text-xl font-bold tracking-tight text-stone-900 dark:text-white">
        <span className={`flex size-10 items-center justify-center rounded-xl border ${accentClasses[accent]}`}>
          <Icon className="size-5" />
        </span>
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function StringList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
        No items specified in blueprint.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TableList({ tables }: { tables?: BlueprintDatabaseTable[] }) {
  if (!tables || tables.length === 0) {
    return (
      <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
        No database tables provided.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {tables.map((table, index) => (
        <div
          key={`${table.name}-${index}`}
          className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800/80 dark:bg-[#161616]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-sm font-bold text-stone-900 dark:text-white">{table.name}</p>
            {table.purpose ? (
              <p className="truncate text-xs font-mono text-stone-500 dark:text-stone-400">
                {table.purpose}
              </p>
            ) : null}
          </div>
          {table.columns && table.columns.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {table.columns.map((column, colIndex) => (
                <span
                  key={`${column}-${colIndex}`}
                  className="rounded-md border border-stone-200 bg-white px-2.5 py-1 font-mono text-[11px] text-stone-800 shadow-2xs dark:border-stone-800 dark:bg-[#1e1e1e] dark:text-stone-200"
                >
                  {column}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function EndpointList({
  endpoints,
}: {
  endpoints?: BlueprintApiEndpoint[];
}) {
  if (!endpoints || endpoints.length === 0) {
    return (
      <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
        No API endpoints provided.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {endpoints.map((endpoint, index) => (
        <div
          key={`${endpoint.method}-${endpoint.path}-${index}`}
          className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800/80 dark:bg-[#161616]"
        >
          <span
            className={`mt-0.5 shrink-0 rounded-md px-2.5 py-1 font-mono text-[11px] font-bold text-white uppercase ${
              endpoint.method.toUpperCase() === "GET"
                ? "bg-emerald-600"
                : endpoint.method.toUpperCase() === "POST"
                  ? "bg-orange-600"
                  : endpoint.method.toUpperCase() === "PATCH" ||
                      endpoint.method.toUpperCase() === "PUT"
                    ? "bg-amber-600"
                    : endpoint.method.toUpperCase() === "DELETE"
                      ? "bg-red-600"
                      : "bg-stone-700"
            }`}
          >
            {endpoint.method.toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="break-all font-mono text-sm font-semibold text-stone-900 dark:text-white">
              {endpoint.path}
            </p>
            {endpoint.description ? (
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                {endpoint.description}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function FolderStructure({ structure }: { structure?: string | string[] }) {
  if (!structure) {
    return (
      <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
        No folder structure provided.
      </p>
    );
  }
  const lines = Array.isArray(structure) ? structure.join("\n") : structure;
  return (
    <pre className="overflow-x-auto rounded-xl border border-stone-200 bg-stone-950 p-5 font-mono text-xs leading-relaxed text-stone-300 dark:border-stone-800">
      {lines}
    </pre>
  );
}

const SECTIONS = [
  {
    key: "functional_requirements",
    title: "Functional Requirements",
    icon: ListChecks,
    accent: "emerald",
  },
  {
    key: "non_functional_requirements",
    title: "Non-Functional Requirements",
    icon: Zap,
    accent: "amber",
  },
  {
    key: "user_roles",
    title: "User Roles & Permissions",
    icon: Users,
    accent: "violet",
  },
  {
    key: "core_features",
    title: "Core System Features",
    icon: Sparkles,
    accent: "brand",
  },
  {
    key: "recommended_tech_stack",
    title: "Recommended Tech Stack",
    icon: Wrench,
    accent: "brand",
  },
  {
    key: "security_recommendations",
    title: "Security & Compliance",
    icon: ShieldCheck,
    accent: "emerald",
  },
  {
    key: "deployment_strategy",
    title: "Deployment & Infrastructure Strategy",
    icon: Cloud,
    accent: "violet",
  },
  {
    key: "development_timeline",
    title: "Development Timeline & Milestones",
    icon: Timer,
    accent: "amber",
  },
] as const;

export function BlueprintViewPage() {
  const { id } = useParams<{ id: string }>();
  const blueprintId = id ? Number(id) : undefined;
  const { data: blueprint, isLoading, isError, refetch } = useBlueprint(blueprintId);
  const [activeTab, setActiveTab] = useState<"blueprint" | "chat">("blueprint");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !blueprint) {
    return (
      <EmptyState
        icon={<BookOpen className="size-6 text-orange-500" />}
        title="Blueprint not found"
        description="This blueprint may have been removed, or you don't have access to it."
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  const data = blueprint.data as ArchitectBlueprint;

  return (
    <div className="space-y-8">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={ROUTES.BLUEPRINTS}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to History
        </Link>

        {/* Action Area: Tab Switcher & Documentation Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-stone-200 bg-white p-1 dark:border-stone-800 dark:bg-[#111111]">
            <button
              type="button"
              onClick={() => setActiveTab("blueprint")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "blueprint"
                  ? "border border-orange-500/40 bg-orange-500/10 text-orange-500 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              }`}
            >
              <Share2 className="size-3.5" />
              Architecture Blueprint
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "border border-orange-500/40 bg-orange-500/10 text-orange-500 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              }`}
            >
              <Bot className="size-3.5" />
              AI Architect Chat
            </button>
          </div>

          <Link to={`/blueprints/${blueprint.id}/documentation`}>
            <Button className="rounded-xl bg-orange-600 px-5 py-2.5 font-sans font-bold text-sm text-white hover:bg-orange-500 shadow-md">
              <BookOpen className="size-4" />
              Documentation Center
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Header Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md">
              <Target className="size-8" />
            </span>
            <div>
              <h2 className="font-serif text-4xl font-normal tracking-tight text-stone-900 dark:text-white sm:text-5xl">
                {blueprint.title}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold text-stone-700 dark:border-stone-800 dark:bg-[#181818] dark:text-stone-300">
                  <CalendarDays className="size-3 text-stone-400" />
                  {formatDate(blueprint.created_at)}
                </span>
                {data.estimated_team_size ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold text-stone-700 dark:border-stone-800 dark:bg-[#181818] dark:text-stone-300">
                    <Users className="size-3 text-stone-400" />
                    Team: {data.estimated_team_size}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold text-stone-700 dark:border-stone-800 dark:bg-[#181818] dark:text-stone-300">
                  <Route className="size-3 text-stone-400" />
                  {data.rest_api_endpoints?.length ?? 0} Endpoints
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main View Area */}
      {activeTab === "chat" && blueprintId ? (
        <ArchitectChatWindow blueprintId={blueprintId} />
      ) : (
        <>
          {/* Executive Summary Highlighted Green Box matching screenshot */}
          {data.project_summary ? (
            <div className="relative rounded-2xl border border-emerald-500/30 bg-[#0a140e] p-7 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
                  [ EXECUTIVE SUMMARY ]
                </span>
                <span className="text-orange-500 text-xs">✦</span>
              </div>
              <p className="font-sans text-base text-stone-200 leading-relaxed sm:text-lg">
                {data.project_summary}
              </p>
            </div>
          ) : null}

          {/* Interactive Mermaid Diagrams Section */}
          <DiagramsSection blueprintId={blueprint.id} prefix={blueprint.title} />

          {/* Database Schema & REST Endpoints Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              icon={Database}
              title="Database Schema Tables"
              accent="violet"
            >
              <TableList tables={data.database_tables} />
            </SectionCard>

            <SectionCard
              icon={Route}
              title="REST API Endpoints"
              accent="emerald"
            >
              <EndpointList endpoints={data.rest_api_endpoints} />
            </SectionCard>
          </div>

          {/* Additional Blueprint Specification Sections */}
          {SECTIONS.map(({ key, title, icon, accent }) => (
            <SectionCard key={key} icon={icon} title={title} accent={accent}>
              <StringList items={data[key]} />
            </SectionCard>
          ))}

          <SectionCard icon={FolderTree} title="Directory & Folder Structure" accent="amber">
            <FolderStructure structure={data.folder_structure} />
          </SectionCard>
        </>
      )}
    </div>
  );
}
