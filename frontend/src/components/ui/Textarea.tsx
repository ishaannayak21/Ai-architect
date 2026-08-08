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
            className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full resize-none rounded-xl border border-[#E6DFD5] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1F2421] shadow-2xs outline-none transition-all duration-200 placeholder:text-[#9A9287] focus:border-[#223829] focus:ring-2 focus:ring-[#223829]/15 dark:border-[#2B3D2F] dark:bg-[#1A241C] dark:text-[#E6ECE7] dark:placeholder:text-[#6B726C] dark:focus:border-[#A3B5A7] dark:focus:ring-[#A3B5A7]/20 font-sans leading-relaxed",
            error && "border-[#C05621] focus:border-[#C05621] focus:ring-[#C05621]/20 dark:border-[#E07A48]",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
        ) : hint ? (
          <p className="text-xs text-stone-500 dark:text-stone-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);
