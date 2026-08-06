import { Layers } from "lucide-react";

import { APP_NAME } from "@/constants";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm shadow-brand-500/30">
        <Layers className="size-4.5 text-white" />
      </span>
      {!compact ? (
        <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
      ) : null}
    </div>
  );
}
