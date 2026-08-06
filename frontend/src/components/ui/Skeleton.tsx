import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton rounded-lg", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
