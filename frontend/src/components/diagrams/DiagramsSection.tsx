import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Cloud,
  Database,
  Network,
  Share2,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DiagramCard } from "@/components/diagrams/DiagramCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDiagrams } from "@/hooks/useDiagrams";
import type { DiagramType } from "@/types";

type Accent = "brand" | "emerald" | "violet" | "amber";

const DIAGRAM_META: Array<{
  type: DiagramType;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
}> = [
  {
    type: "system_architecture",
    title: "System Architecture",
    description: "High-level components and how they connect",
    icon: Network,
    accent: "brand",
  },
  {
    type: "database_er",
    title: "Database ER Diagram",
    description: "Entities, attributes and their relationships",
    icon: Database,
    accent: "violet",
  },
  {
    type: "application_flowchart",
    title: "Application Flowchart",
    description: "Core end-to-end user workflow",
    icon: Workflow,
    accent: "emerald",
  },
  {
    type: "api_sequence",
    title: "API Request Sequence",
    description: "Request flow between actors and services",
    icon: ArrowLeftRight,
    accent: "amber",
  },
  {
    type: "deployment",
    title: "Deployment Architecture",
    description: "Production deployment topology",
    icon: Cloud,
    accent: "brand",
  },
];

export function DiagramsSection({
  blueprintId,
  prefix,
}: {
  blueprintId: number | undefined;
  prefix: string;
}) {
  const {
    byType,
    isLoading,
    isError,
    refetch,
    generateAll,
    isGeneratingAll,
    regenerate,
  } = useDiagrams(blueprintId);

  const [regeneratingType, setRegeneratingType] = useState<DiagramType | null>(
    null,
  );

  const hasDiagrams = DIAGRAM_META.some((meta) => byType[meta.type]);

  const handleGenerateAll = async () => {
    try {
      await generateAll();
      toast.success("All architecture diagrams generated");
    } catch {
      toast.error(
        "We couldn't generate the diagrams. The AI service may be busy — please try again.",
      );
    }
  };

  const handleRegenerate = async (type: DiagramType) => {
    setRegeneratingType(type);
    try {
      await regenerate(type);
      toast.success("Diagram regenerated");
    } catch {
      toast.error(
        "We couldn't regenerate this diagram. The AI service may be busy — please try again.",
      );
    } finally {
      setRegeneratingType(null);
    }
  };

  return (
    <section className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 text-white">
            <Share2 className="size-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              Architecture Diagrams
            </h3>
            <p className="text-sm text-ink/50 dark:text-white/50">
              Visual Mermaid diagrams generated from this blueprint.
            </p>
          </div>
        </div>
        {hasDiagrams && !isLoading ? (
          <Button
            variant="outline"
            loading={isGeneratingAll}
            onClick={handleGenerateAll}
          >
            <Sparkles className="size-4" />
            Regenerate all
          </Button>
        ) : null}
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<Share2 className="size-6" />}
          title="Couldn't load the diagrams"
          description="Something went wrong while fetching the diagrams for this blueprint."
          action={
            <Button variant="secondary" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !hasDiagrams ? (
        <EmptyState
          icon={<Share2 className="size-6" />}
          title="No diagrams generated"
          description="Generate the five standard architecture diagrams for this blueprint: system architecture, database ER, application flowchart, API sequence and deployment."
          action={
            <Button loading={isGeneratingAll} onClick={handleGenerateAll}>
              <Sparkles className="size-4" />
              Generate diagrams
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {DIAGRAM_META.map((meta, index) => (
            <DiagramCard
              key={meta.type}
              type={meta.type}
              title={meta.title}
              description={meta.description}
              icon={meta.icon}
              accent={meta.accent}
              prefix={prefix}
              diagram={byType[meta.type]}
              onRegenerate={handleRegenerate}
              isRegenerating={regeneratingType === meta.type}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}