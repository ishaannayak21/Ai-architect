import { Box, LogOut, Moon, Palette, ShieldCheck, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Ivory Paper", icon: Sun },
  { value: "dark", label: "Forest Night", icon: Moon },
];

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7] sm:text-4xl">
          System Settings
        </h2>
        <p className="mt-2 font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
          Customize display preferences and manage active user sessions.
        </p>
      </div>

      {/* Card 1: Theme Appearance */}
      <Card className="p-7">
        <h3 className="flex items-center gap-3 font-serif text-xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">
          <Palette className="size-5 text-[#223829] dark:text-[#A3B5A7]" />
          Theme Appearance
        </h3>
        <p className="mt-1.5 font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
          Choose between Ivory Paper (light) or Forest Night (dark) theme.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border px-5 py-3.5 font-serif text-sm font-bold transition-all shadow-2xs",
                theme === value
                  ? value === "dark"
                    ? "border-[#283C2D] bg-[#283C2D] text-white dark:bg-[#283C2D] dark:border-[#3E5C46]"
                    : "border-[#1F2421] bg-white text-[#1F2421] shadow-xs"
                  : "border-[#E6DFD5] bg-[#FFFFFF]/60 text-[#6B726C] hover:bg-white hover:text-[#1F2421] dark:border-[#2B3D2F] dark:bg-[#1A241C] dark:text-[#A3B5A7]",
              )}
            >
              <Icon className="size-4.5" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Card 2: Active Session */}
      <Card className="p-7">
        <h3 className="flex items-center gap-3 font-serif text-xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">
          <ShieldCheck className="size-5 text-[#223829] dark:text-[#A3B5A7]" />
          Active Session
        </h3>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-sans text-sm text-[#4A524C] dark:text-[#A3B5A7]">
              Signed in as{" "}
              <span className="font-mono font-bold text-[#1F2421] dark:text-white">
                {user?.email}
              </span>
            </p>
            <p className="mt-1 font-sans text-xs text-[#6B726C] dark:text-[#A3B5A7]">
              Session is secured with encrypted JWT bearer tokens.
            </p>
          </div>
          <Button variant="danger" onClick={handleLogout} className="px-5 py-2.5">
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Card 3: System Architecture Engine */}
      <Card className="relative overflow-hidden p-7">
        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="flex items-center gap-3 font-serif text-xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">
              <Box className="size-5 text-[#223829] dark:text-[#A3B5A7]" />
              System Architecture Engine
            </h3>
            <p className="font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7] leading-relaxed pt-2">
              Current environment is optimized for performance and reliability. All systems operational.
            </p>
          </div>
          <Badge variant="success" className="px-3.5 py-1 text-xs">
            Production
          </Badge>
        </div>

        {/* Architectural Wireframe SVG Illustration */}
        <svg
          aria-hidden="true"
          className="absolute -right-4 -bottom-4 size-40 text-[#223829]/15 dark:text-[#A3B5A7]/10 pointer-events-none"
          fill="none"
          viewBox="0 0 120 120"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M20 90 L60 20 L100 90 Z" />
          <path d="M20 90 L60 65 L100 90" />
          <path d="M60 20 L60 65" />
          <path d="M35 55 L85 55" />
          <path d="M28 72 L92 72" />
          <line x1="10" y1="105" x2="110" y2="105" />
          <line x1="60" y1="20" x2="60" y2="105" strokeDasharray="3 3" />
        </svg>
      </Card>
    </div>
  );
}