import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type BadgeVariant = "brand" | "success" | "warning" | "neutral" | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand:
    "border border-[#C5D8C9] bg-[#E8F0EA] text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7] font-medium",
  success:
    "border border-[#C5D8C9] bg-[#E8F0EA] text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7] font-medium",
  warning:
    "border border-[#F3D9C8] bg-[#FDF3EE] text-[#C05621] dark:border-[#522916] dark:bg-[#331C13] dark:text-[#E07A48] font-medium",
  danger:
    "border border-[#F3D9C8] bg-[#FDF3EE] text-[#C05621] dark:border-[#522916] dark:bg-[#331C13] dark:text-[#E07A48] font-medium",
  neutral:
    "border border-[#E6DFD5] bg-[#FAF7F2] text-[#6B726C] dark:border-[#2B3D2F] dark:bg-[#1E2B21] dark:text-[#A3B5A7] font-medium",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-mono tracking-tight",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
