import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-semibold text-white">
      {initials}
    </span>
  );
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuOpen = mobileOpen;

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate(ROUTES.LOGIN);
  };

  const path = location.pathname;
  const title =
    path === ROUTES.DASHBOARD
      ? "Dashboard"
      : path === ROUTES.PROJECTS
        ? "Projects"
        : path === ROUTES.NEW_PROJECT
          ? "New Project"
          : path === ROUTES.BLUEPRINTS
            ? "Project History"
            : path.startsWith("/blueprints/")
              ? "Blueprint"
              : path === ROUTES.PROFILE
                ? "Profile"
                : "Settings";

  return (
    <div className="min-h-screen bg-surface dark:bg-[#05060a]">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-[#05060a]/70">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-ink/10 text-ink/70 lg:hidden dark:border-white/10 dark:text-white/70"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold">{title}</h1>
            </div>

            <ThemeToggle />

            <div className="flex items-center gap-2">
              <span
                className="hidden text-right sm:block"
                title={user ? user.email : undefined}
              >
                <span className="block max-w-[10rem] truncate text-sm font-medium">
                  {user ? user.name : ""}
                </span>
                <span className="block truncate text-xs text-ink/45 dark:text-white/45">
                  {user ? user.email : ""}
                </span>
              </span>
              {user ? <UserAvatar name={user.name} /> : null}
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  "inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-ink/10 text-ink/60 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:border-white/10 dark:text-white/60",
                )}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <Outlet />
        </main>

        <footer className="px-4 pb-8 text-center text-xs text-ink/40 dark:text-white/40">
          <Link to={ROUTES.PROFILE} className="hover:text-ink/70">
            AI Software Architect
          </Link>{" "}
          — Milestone 2
        </footer>
      </div>
    </div>
  );
}