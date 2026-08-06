import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  accentClassName?: string;
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  accentClassName = "bg-brand-500/10 text-brand-500 dark:bg-brand-400/10 dark:text-brand-300",
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink/60 dark:text-white/50">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</p>
          {hint ? (
            <p className="mt-1 text-xs text-ink/45 dark:text-white/40">{hint}</p>
          ) : null}
        </div>
        <div className={`flex size-10 items-center justify-center rounded-xl ${accentClassName}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
