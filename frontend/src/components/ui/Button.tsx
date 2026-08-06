import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white shadow-sm shadow-brand-500/30 hover:bg-brand-400",
  secondary:
    "bg-ink/[0.06] text-ink hover:bg-ink/[0.1] dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]",
  outline:
    "border border-ink/15 text-ink hover:bg-ink/[0.04] dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]",
  ghost:
    "text-ink/70 hover:bg-ink/[0.05] hover:text-ink dark:text-white/70 dark:hover:bg-white/[0.07] dark:hover:text-white",
  danger: "bg-red-500 text-white shadow-sm shadow-red-500/30 hover:bg-red-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
  lg: "h-12 gap-2 rounded-xl px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-ink",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? <Spinner className="size-4" /> : leftIcon}
        {children}
      </motion.button>
    );
  },
);
