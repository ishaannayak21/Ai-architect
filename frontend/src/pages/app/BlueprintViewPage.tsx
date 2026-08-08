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
    brand: "border-[#C5D8C9] bg-[#E8F0EA] text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7]",
    emerald:
      "border-[#C5D8C9] bg-[#E8F0EA] text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7]",
    violet:
      "border-[#E6DFD5] bg-[#FAF7F2] text-[#1F2421] dark:border-[#2B3D2F] dark:bg-[#1E2B21] dark:text-[#E6ECE7]",
    amber: "border-[#F3D9C8] bg-[#FDF3EE] text-[#C05621] dark:border-[#522916] dark:bg-[#331C13] dark:text-[#E07A48]",
  };

  return (
    <Card className="p-6 sm:p-7">
      <h3 className="flex items-center gap-3 font-serif text-xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">
        <span
          className={`flex size-9 items-center justify-center rounded-xl border ${accentClasses[accent]}`}
        >
          <Icon className="size-4.5" />
        </span>
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function StringList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="font-mono text-xs text-[#6B726C]">
        No items specified in blueprint.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-sm text-[#4A524C] dark:text-[#A3B5A7] leading-relaxed font-sans">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C05621]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TableList({ tables }: { tables?: BlueprintDatabaseTable[] }) {
  if (!tables || tables.length === 0) {
    return (
      <p className="font-mono text-xs text-[#6B726C]">
        No database tables provided.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {tables.map((table, index) => (
        <div
          key={`${table.name}-${index}`}
          className="rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] p-4 dark:border-[#2B3D2F] dark:bg-[#1A241C]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-sm font-bold text-[#1F2421] dark:text-[#E6ECE7]">{table.name}</p>
            {table.purpose ? (
              <p className="truncate text-xs font-mono text-[#6B726C] dark:text-[#A3B5A7]">
                {table.purpose}
              </p>
            ) : null}
          </div>
          {table.columns && table.columns.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {table.columns.map((column, colIndex) => (
                <span
                  key={`${column}-${colIndex}`}
                  className="rounded-md border border-[#E6DFD5] bg-white px-2.5 py-1 font-mono text-[11px] text-[#1F2421] shadow-2xs dark:border-[#2B3D2F] dark:bg-[#1E2B21] dark:text-[#E6ECE7]"
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
      <p className="font-mono text-xs text-[#6B726C]">
        No API endpoints provided.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {endpoints.map((endpoint, index) => (
        <div
          key={`${endpoint.method}-${endpoint.path}-${index}`}
          className="flex items-start gap-3 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] p-4 dark:border-[#2B3D2F] dark:bg-[#1A241C]"
        >
          <span
            className={`mt-0.5 shrink-0 rounded-md px-2.5 py-1 font-mono text-[11px] font-bold text-white uppercase ${
              endpoint.method.toUpperCase() === "GET"
                ? "bg-[#223829]"
                : endpoint.method.toUpperCase() === "POST"
                  ? "bg-[#C05621]"
                  : endpoint.method.toUpperCase() === "PATCH" ||
                      endpoint.method.toUpperCase() === "PUT"
                    ? "bg-[#A8481A]"
                    : endpoint.method.toUpperCase() === "DELETE"
                      ? "bg-[#C05621]"
                      : "bg-[#4A524C]"
            }`}
          >
            {endpoint.method.toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="break-all font-mono text-sm font-semibold text-[#1F2421] dark:text-[#E6ECE7]">
              {endpoint.path}
            </p>
            {endpoint.description ? (
              <p className="mt-1 text-xs text-[#6B726C] dark:text-[#A3B5A7]">
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
      <p className="font-mono text-xs text-[#6B726C]">
        No folder structure provided.
      </p>
    );
  }
  const lines = Array.isArray(structure) ? structure.join("\n") : structure;
  return (
    <pre className="overflow-x-auto rounded-xl border border-[#2B3D2F] bg-[#141C16] p-5 font-mono text-xs leading-relaxed text-[#A3B5A7] dark:border-[#2B3D2F]">
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
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#C05621] hover:text-[#A8481A] dark:text-[#E07A48]"
        >
          <ArrowLeft className="size-4" />
          Back to History
        </Link>

        {/* Retro Tab Switcher */}
        <div className="inline-flex rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] p-1 dark:border-[#2B3D2F] dark:bg-[#1E2B21]">
          <button
            type="button"
            onClick={() => setActiveTab("blueprint")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-serif text-xs font-bold tracking-wide transition-all ${
              activeTab === "blueprint"
                ? "bg-[#C05621] text-white shadow-2xs"
                : "text-[#6B726C] hover:text-[#1F2421] dark:text-[#A3B5A7] dark:hover:text-white"
            }`}
          >
            <Sparkles className="size-3.5" />
            Architecture Blueprint
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-serif text-xs font-bold tracking-wide transition-all ${
              activeTab === "chat"
                ? "bg-[#C05621] text-white shadow-2xs"
                : "text-[#6B726C] hover:text-[#1F2421] dark:text-[#A3B5A7] dark:hover:text-white"
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
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#344A39] bg-[#223829] text-white font-bold shadow-md">
              <Target className="size-7 text-[#E8F0EA]" />
            </span>
            <div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">
                {blueprint.title}
              </h2>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
                  {data.rest_api_endpoints?.length ?? 0} Endpoints
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
            <Card className="p-6 sm:p-7 border-l-4 border-l-[#C05621]">
              <p className="font-mono text-xs uppercase tracking-wider text-[#C05621] dark:text-[#E07A48] font-bold mb-2">[ EXECUTIVE SUMMARY ]</p>
              <p className="text-[#4A524C] dark:text-[#A3B5A7] leading-relaxed text-sm sm:text-base font-sans">{data.project_summary}</p>
            </Card>
          ) : null}

          <DiagramsSection blueprintId={blueprint.id} prefix={blueprint.title} />

          <div className="grid gap-4 lg:grid-cols-2">
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
