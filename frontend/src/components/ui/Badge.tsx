import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type BadgeVariant = "brand" | "success" | "warning" | "neutral" | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: "bg-brand-500/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  warning:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  danger: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-300",
  neutral:
    "bg-ink/[0.06] text-ink/60 dark:bg-white/[0.08] dark:text-white/60",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
