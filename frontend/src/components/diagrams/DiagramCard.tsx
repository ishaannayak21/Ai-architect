import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { DiagramViewer } from "@/components/diagrams/DiagramViewer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Diagram } from "@/types";
import { cn } from "@/utils/cn";

type Accent = "brand" | "emerald" | "violet" | "amber";

const accentClasses: Record<Accent, string> = {
  brand: "bg-brand-500/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300",
  emerald:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  violet:
    "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  amber:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
};

interface DiagramCardProps {
  type: Diagram["diagram_type"];
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
  prefix: string;
  diagram?: Diagram;
  onRegenerate: (type: Diagram["diagram_type"]) => Promise<void>;
  isRegenerating: boolean;
  index: number;
}

function FullscreenDiagram({
  open,
  onClose,
  title,
  icon: Icon,
  accent,
  diagram,
  prefix,
  onRegenerate,
  isRegenerating,
}: Omit<DiagramCardProps, "type" | "index" | "description"> & {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleRegenerate = useCallback(() => {
    if (diagram) {
      void onRegenerate(diagram.diagram_type);
    }
  }, [diagram, onRegenerate]);

  return (
    <AnimatePresence>
      {open && diagram ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-2xl dark:border-white/10 dark:bg-[#0b0e14]"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4 dark:border-white/10">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  accentClasses[accent],
                )}
              >
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/[0.06] hover:text-ink dark:text-white/50 dark:hover:bg-white/[0.08] dark:hover:text-white"
                aria-label="Close fullscreen"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <DiagramViewer
                code={diagram.mermaid_code}
                diagramType={diagram.diagram_type}
                filenamePrefix={prefix}
                isFullscreen
                onToggleFullscreen={onClose}
                onRegenerate={handleRegenerate}
                isRegenerating={isRegenerating}
              />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export function DiagramCard({
  type,
  title,
  description,
  icon: Icon,
  accent,
  prefix,
  diagram,
  onRegenerate,
  isRegenerating,
  index,
}: DiagramCardProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const handleRegenerate = useCallback(() => {
    if (diagram) {
      void onRegenerate(diagram.diagram_type);
    }
  }, [diagram, onRegenerate]);

  if (!diagram) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
      >
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                accentClasses[accent],
              )}
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="truncate text-xs text-ink/50 dark:text-white/50">
                {description}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-4 dark:border-white/10">
            <p className="text-sm text-ink/50 dark:text-white/50">
              Not generated yet.
            </p>
            <Button
              size="sm"
              loading={isRegenerating}
              onClick={() => onRegenerate(type)}
            >
              <Sparkles className="size-3.5" />
              Generate
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
      >
        <Card className="overflow-visible">
          <div className="flex items-center gap-3 px-5 pb-3 pt-4">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                accentClasses[accent],
              )}
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="truncate text-sm text-ink/50 dark:text-white/50">
                {description}
              </p>
            </div>
          </div>

          <DiagramViewer
            code={diagram.mermaid_code}
            diagramType={diagram.diagram_type}
            filenamePrefix={prefix}
            isFullscreen={false}
            onToggleFullscreen={() => setFullscreen(true)}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        </Card>
      </motion.div>

      <FullscreenDiagram
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        title={title}
        icon={Icon}
        accent={accent}
        prefix={prefix}
        diagram={diagram}
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      />
    </>
  );
}