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
  accentClassName = "bg-[#FDF3EE] text-[#C05621] border border-[#F3D9C8] dark:bg-[#331C13] dark:text-[#E07A48]",
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B726C] dark:text-[#A3B5A7]">
            {label}
          </p>
          <p className="mt-2.5 font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 font-sans text-xs text-[#6B726C] dark:text-[#A3B5A7]">{hint}</p>
          ) : null}
        </div>
        <div className={`flex size-10 items-center justify-center rounded-xl ${accentClassName}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
