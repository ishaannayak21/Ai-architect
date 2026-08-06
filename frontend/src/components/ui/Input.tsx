import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export { type InputProps };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightSlot,
    className,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink/80 dark:text-white/80"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink/40 dark:text-white/40">
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink/35 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30",
            leftIcon && "pl-10",
            rightSlot && "pr-10",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/30",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {rightSlot ? (
          <span className="absolute inset-y-0 right-2 flex items-center">
            {rightSlot}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink/50 dark:text-white/50">{hint}</p>
      ) : null}
    </div>
  );
});
