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
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E6DFD5] bg-[#FAF7F2]/60 px-6 py-16 text-center dark:border-[#2B3D2F] dark:bg-[#1E2B21]/30",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-[#C5D8C9] bg-[#E8F0EA] text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7]">
        {icon}
      </div>
      <h3 className="mt-5 font-serif text-xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">{title}</h3>
      <p className="mt-2 max-w-sm font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
