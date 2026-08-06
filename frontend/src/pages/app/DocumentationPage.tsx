import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DocumentationViewer } from "@/components/documentation/DocumentationViewer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBlueprint } from "@/hooks/useBlueprints";
import { useDocumentation } from "@/hooks/useDocumentation";
import { formatDate } from "@/utils/formatters";

export function DocumentationPage() {
  const { id } = useParams<{ id: string }>();
  const blueprintId = id ? Number(id) : undefined;

  const { data: blueprint, isLoading: isBlueprintLoading } = useBlueprint(blueprintId);
  const {
    data: doc,
    isLoading: isDocLoading,
    isError,
    refetch,
    regenerate,
    isRegenerating,
  } = useDocumentation(blueprintId);

  const isLoading = isBlueprintLoading || isDocLoading;

  const handleRegenerate = async () => {
    try {
      await regenerate();
      toast.success("Documentation regenerated successfully!");
    } catch {
      toast.error("Failed to regenerate documentation. Please try again.");
    }
  };

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
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !blueprint || !doc) {
    return (
      <EmptyState
        icon={<BookOpen className="size-6" />}
        title="Documentation not found"
        description="Could not load the documentation for this project."
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={`/blueprints/${blueprint.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-400"
        >
          <ArrowLeft className="size-4" />
          Back to blueprint
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 text-white">
              <BookOpen className="size-7" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {blueprint.title} - Documentation Center
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge variant="success">
                  <CalendarDays className="size-3" />
                  Created {formatDate(doc.created_at)}
                </Badge>
                {doc.updated_at ? (
                  <Badge variant="neutral">
                    Updated {formatDate(doc.updated_at)}
                  </Badge>
                ) : null}
                <Badge variant="brand">14 Standard Sections</Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <DocumentationViewer
        blueprintId={blueprint.id}
        title={blueprint.title}
        data={doc.data}
        isRegenerating={isRegenerating}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}
