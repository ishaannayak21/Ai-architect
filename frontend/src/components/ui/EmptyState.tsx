import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center dark:border-white/15",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 dark:bg-brand-400/10 dark:text-brand-300">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink/55 dark:text-white/50">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
