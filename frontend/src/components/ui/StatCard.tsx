import type { ReactNode } from "react";

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
  accentClassName = "border border-orange-500/30 bg-orange-500/10 text-orange-500",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-stone-300 dark:border border-stone-800/80 dark:bg-[#111111] dark:hover:border-stone-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
            {label}
          </p>
          <p className="mt-4 font-serif text-4xl font-normal tracking-tight text-stone-900 dark:text-white">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 font-mono text-[11px] text-stone-500 dark:text-stone-400">{hint}</p>
          ) : null}
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accentClassName}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
