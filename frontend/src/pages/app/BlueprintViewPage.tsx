import { useState } from "react";
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
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ArchitectChatWindow } from "@/components/chat/ArchitectChatWindow";
import { DiagramsSection } from "@/components/diagrams/DiagramsSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    brand: "bg-brand-500/10 text-brand-500 dark:bg-brand-400/10 dark:text-brand-300",
    emerald:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
    violet:
      "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
    amber: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  };

  return (
    <Card className="p-5">
      <h3 className="flex items-center gap-2 font-semibold">
        <span
          className={`flex size-8 items-center justify-center rounded-lg ${accentClasses[accent]}`}
        >
          <Icon className="size-4" />
        </span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

function StringList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-ink/45 dark:text-white/45">
        No items provided.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
          <span className="text-ink/75 dark:text-white/75">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TableList({ tables }: { tables?: BlueprintDatabaseTable[] }) {
  if (!tables || tables.length === 0) {
    return (
      <p className="text-sm text-ink/45 dark:text-white/45">
        No tables provided.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {tables.map((table, index) => (
        <div
          key={`${table.name}-${index}`}
          className="rounded-xl border border-ink/10 p-3 dark:border-white/10"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-sm font-semibold">{table.name}</p>
            {table.purpose ? (
              <p className="truncate text-xs text-ink/45 dark:text-white/45">
                {table.purpose}
              </p>
            ) : null}
          </div>
          {table.columns && table.columns.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {table.columns.map((column, colIndex) => (
                <span
                  key={`${column}-${colIndex}`}
                  className="rounded-md bg-ink/[0.05] px-2 py-1 font-mono text-[11px] text-ink/65 dark:bg-white/[0.07] dark:text-white/65"
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
      <p className="text-sm text-ink/45 dark:text-white/45">
        No endpoints provided.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {endpoints.map((endpoint, index) => (
        <div
          key={`${endpoint.method}-${endpoint.path}-${index}`}
          className="flex items-start gap-3 rounded-xl border border-ink/10 p-3 dark:border-white/10"
        >
          <span
            className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold text-white ${
              endpoint.method.toUpperCase() === "GET"
                ? "bg-sky-500"
                : endpoint.method.toUpperCase() === "POST"
                  ? "bg-emerald-500"
                  : endpoint.method.toUpperCase() === "PATCH" ||
                      endpoint.method.toUpperCase() === "PUT"
                    ? "bg-amber-500"
                    : endpoint.method.toUpperCase() === "DELETE"
                      ? "bg-red-500"
                      : "bg-ink/40"
            }`}
          >
            {endpoint.method.toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="break-all font-mono text-sm text-ink/80 dark:text-white/80">
              {endpoint.path}
            </p>
            {endpoint.description ? (
              <p className="mt-0.5 text-xs text-ink/50 dark:text-white/50">
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
      <p className="text-sm text-ink/45 dark:text-white/45">
        No folder structure provided.
      </p>
    );
  }
  const lines = Array.isArray(structure) ? structure.join("\n") : structure;
  return (
    <pre className="overflow-x-auto rounded-xl bg-ink/[0.03] p-4 font-mono text-xs leading-relaxed text-ink/75 dark:bg-white/[0.04] dark:text-white/75">
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
    title: "User Roles",
    icon: Users,
    accent: "violet",
  },
  {
    key: "core_features",
    title: "Core Features",
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
    title: "Security Recommendations",
    icon: ShieldCheck,
    accent: "emerald",
  },
  {
    key: "deployment_strategy",
    title: "Deployment Strategy",
    icon: Cloud,
    accent: "violet",
  },
  {
    key: "development_timeline",
    title: "Development Timeline",
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
        icon={<BookOpen className="size-6" />}
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={ROUTES.BLUEPRINTS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-400"
        >
          <ArrowLeft className="size-4" />
          Back to history
        </Link>

        {/* Tab View Switcher */}
        <div className="inline-flex rounded-xl border border-ink/10 bg-white/70 p-1 backdrop-blur-sm dark:border-white/10 dark:bg-ink-dark/70">
          <button
            type="button"
            onClick={() => setActiveTab("blueprint")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "blueprint"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-ink/65 hover:text-ink dark:text-white/65 dark:hover:text-white"
            }`}
          >
            <Sparkles className="size-3.5" />
            Architecture Blueprint
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-ink/65 hover:text-ink dark:text-white/65 dark:hover:text-white"
            }`}
          >
            <Bot className="size-3.5" />
            AI Architect Chat
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 text-white">
              <Target className="size-7" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {blueprint.title}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge variant="success">
                  <CalendarDays className="size-3" />
                  {formatDate(blueprint.created_at)}
                </Badge>
                {data.estimated_team_size ? (
                  <Badge variant="brand">
                    <Users className="size-3" />
                    Team: {data.estimated_team_size}
                  </Badge>
                ) : null}
                <Badge variant="neutral">
                  <Route className="size-3" />
                  {data.rest_api_endpoints?.length ?? 0} endpoints
                </Badge>
              </div>
            </div>
          </div>

          <Link to={`/blueprints/${blueprint.id}/documentation`}>
            <Button size="lg">
              <BookOpen className="size-4" />
              Documentation Center
            </Button>
          </Link>
        </div>
      </motion.div>

      {activeTab === "chat" && blueprintId ? (
        <ArchitectChatWindow blueprintId={blueprintId} />
      ) : (
        <>
          {data.project_summary ? (
            <Card className="p-5">
              <p className="text-ink/75 dark:text-white/75">{data.project_summary}</p>
            </Card>
          ) : null}

          <DiagramsSection blueprintId={blueprint.id} prefix={blueprint.title} />

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard
              icon={Database}
              title="Database Tables"
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

          {SECTIONS.map(({ key, title, icon, accent }) => (
            <SectionCard key={key} icon={icon} title={title} accent={accent}>
              <StringList items={data[key]} />
            </SectionCard>
          ))}

          <SectionCard icon={FolderTree} title="Folder Structure" accent="amber">
            <FolderStructure structure={data.folder_structure} />
          </SectionCard>
        </>
      )}
    </div>
  );
}
