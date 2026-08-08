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
    <span className="flex size-9 items-center justify-center rounded-full bg-[#223829] font-sans text-xs font-bold text-white shadow-2xs border border-[#344A39]">
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-[#141C16]/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-68">
        <header className="sticky top-0 z-20 border-b border-[#E6DFD5] bg-[#FAF7F2]/90 backdrop-blur-md dark:border-[#2B3D2F] dark:bg-[#141C16]/90">
          <div className="flex h-16 items-center gap-4 px-6 sm:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[#E6DFD5] bg-white text-[#1F2421] lg:hidden dark:border-[#2B3D2F] dark:bg-[#1E2B21] dark:text-[#E6ECE7]"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-serif text-xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">
                {title}
              </h1>
            </div>

            <ThemeToggle />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                {user ? <UserAvatar name={user.name} /> : null}
                <span
                  className="hidden text-left sm:block"
                  title={user ? user.email : undefined}
                >
                  <span className="block max-w-[10rem] truncate font-serif text-xs font-bold text-[#1F2421] dark:text-[#E6ECE7]">
                    {user ? user.name : ""}
                  </span>
                  <span className="block truncate font-mono text-[10px] text-[#6B726C] dark:text-[#A3B5A7]">
                    {user ? user.email : ""}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  "inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[#E6DFD5] bg-[#233527] text-white transition-all hover:bg-[#C05621] dark:border-[#2B3D2F] dark:bg-[#283C2D] dark:hover:bg-[#C05621]",
                )}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-10">
          <Outlet />
        </main>

        <footer className="px-6 pb-8 text-center font-mono text-xs text-[#6B726C] dark:text-[#A3B5A7]">
          <Link to={ROUTES.PROFILE} className="hover:text-[#1F2421] dark:hover:text-white">
            AI Software Architect
          </Link>{" "}
          — Modern-Retro Engineering System
        </footer>
      </div>
    </div>
  );
}