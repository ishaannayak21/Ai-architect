import { LogOut, Moon, Palette, Sun } from "lucide-react";
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
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
          Customize your experience and manage your session.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <Palette className="size-4.5 text-brand-500" />
          Appearance
        </h3>
        <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
          Choose how the app looks on your device.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                theme === value
                  ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300"
                  : "border-ink/15 text-ink/60 hover:bg-ink/[0.04] dark:border-white/15 dark:text-white/60 dark:hover:bg-white/[0.06]",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Session</h3>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-ink/70 dark:text-white/70">
              Signed in as{" "}
              <span className="font-medium">{user?.email}</span>
            </p>
            <p className="mt-0.5 text-xs text-ink/45 dark:text-white/45">
              Sessions are secured with signed JWT tokens.
            </p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Milestone 2</h3>
            <p className="mt-0.5 text-sm text-ink/55 dark:text-white/50">
              Foundation, authentication, project management and AI blueprint
              generation are live. Diagrams &amp; PDF export ship in the next
              milestone.
            </p>
          </div>
          <Badge variant="success">Stable</Badge>
        </div>
      </Card>
    </div>
  );
}