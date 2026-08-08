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
    "bg-[#C05621] text-white shadow-2xs hover:bg-[#A8481A] active:bg-[#943F16] font-medium border border-[#A8481A]/20 dark:bg-[#C05621] dark:hover:bg-[#A8481A]",
  secondary:
    "bg-[#223829] text-white hover:bg-[#1B2D21] active:bg-[#15241A] border border-[#344A39] dark:bg-[#283C2D] dark:hover:bg-[#203124] font-medium",
  outline:
    "border border-[#E6DFD5] text-[#1F2421] hover:bg-[#F2ECE1] dark:border-[#2B3D2F] dark:text-[#E6ECE7] dark:hover:bg-[#243226] font-medium",
  ghost:
    "text-[#1F2421] hover:bg-[#F2ECE1] hover:text-[#192B1F] dark:text-[#E6ECE7] dark:hover:bg-[#243226] dark:hover:text-white font-medium",
  danger:
    "bg-[#C05621] text-white shadow-2xs hover:bg-[#A8481A] active:bg-[#943F16] font-medium border border-[#A8481A]/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8.5 gap-1.5 rounded-lg px-3 text-xs tracking-wide",
  md: "h-10.5 gap-2 rounded-xl px-4.5 text-sm tracking-wide",
  lg: "h-12.5 gap-2.5 rounded-xl px-6 text-base tracking-wide font-semibold",
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
        whileHover={{ y: -1.5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-900 active:translate-y-0.5",
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
