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
          className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-stone-400 dark:text-stone-500">
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-xl border border-[#E6DFD5] bg-[#FFFFFF] px-3.5 text-sm text-[#1F2421] shadow-2xs outline-none transition-all duration-200 placeholder:text-[#9A9287] focus:border-[#223829] focus:ring-2 focus:ring-[#223829]/15 dark:border-[#2B3D2F] dark:bg-[#1A241C] dark:text-[#E6ECE7] dark:placeholder:text-[#6B726C] dark:focus:border-[#A3B5A7] dark:focus:ring-[#A3B5A7]/20 font-sans",
            leftIcon && "pl-10.5",
            rightSlot && "pr-10.5",
            error &&
              "border-[#C05621] focus:border-[#C05621] focus:ring-[#C05621]/20 dark:border-[#E07A48]",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {rightSlot ? (
          <span className="absolute inset-y-0 right-2.5 flex items-center">
            {rightSlot}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-stone-500 dark:text-stone-400">{hint}</p>
      ) : null}
    </div>
  );
});
