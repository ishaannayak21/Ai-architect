import { APP_NAME } from "@/constants";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 font-sans text-base font-extrabold tracking-tight text-stone-900 dark:text-white select-none",
        className,
      )}
    >
      <span>{APP_NAME}</span>
      <span className="text-orange-500 font-bold text-sm">✦</span>
    </div>
  );
}
