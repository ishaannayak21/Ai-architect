import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightSlot?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, className, id, ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-ink/80 dark:text-white/80"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full resize-none rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink/35 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-ink/50 dark:text-white/50">{hint}</p>
        ) : null}
      </div>
    );
  },
);
