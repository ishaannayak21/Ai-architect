import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl shadow-sm",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/10",
        className,
      )}
      {...props}
    />
  );
}
