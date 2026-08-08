import { Layers } from "lucide-react";

import { APP_NAME } from "@/constants";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#233527] text-white shadow-2xs border border-[#344A39]">
        <Layers className="size-5 text-[#E8F0EA]" />
      </span>
      {!compact ? (
        <div className="flex flex-col">
          <span className="font-serif text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
            {APP_NAME}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C8275] dark:text-[#A3B5A7] font-semibold">
            ENGINEERING BLUEPRINT
          </span>
        </div>
      ) : null}
    </div>
  );
}
