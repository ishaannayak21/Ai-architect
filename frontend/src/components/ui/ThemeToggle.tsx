import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[#E6DFD5] bg-[#FFFFFF] text-[#1F2421] shadow-2xs transition-all duration-200 hover:border-[#223829]/30 hover:bg-[#FAF7F2] dark:border-[#2B3D2F] dark:bg-[#1E2B21] dark:text-[#E6ECE7] dark:hover:border-[#A3B5A7]/40 dark:hover:bg-[#243226]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to Ivory Paper or Forest Night theme" : "Switch to Ivory Paper or Forest Night theme"}
    >
      {isDark ? <Sun className="size-4 text-[#E07A48]" /> : <Moon className="size-4 text-[#1F2421]" />}
    </button>
  );
}
