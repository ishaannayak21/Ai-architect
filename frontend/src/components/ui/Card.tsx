import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E6DFD5] bg-[#FAF7F2] p-6 shadow-[0_2px_12px_-3px_rgba(34,56,41,0.04)] transition-all duration-200 dark:border-[#2B3D2F] dark:bg-[#1E2B21] dark:shadow-[0_2px_16px_-2px_rgba(0,0,0,0.4)]",
        hover &&
          "hover:-translate-y-0.5 hover:border-[#C05621]/40 hover:shadow-[0_6px_20px_-4px_rgba(192,86,33,0.1)] dark:hover:border-[#223829]",
        className,
      )}
      {...props}
    />
  );
}
