import {
  BarChart3,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";
import { cn } from "@/utils/cn";

const navItems = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.PROJECTS, label: "Projects", icon: FolderKanban },
  { to: ROUTES.BLUEPRINTS, label: "Project History", icon: ClipboardList },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
  { to: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-ink/10 bg-white/40 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex h-12 items-center px-2">
        <Logo />
      </div>

      <Link
        to={ROUTES.NEW_PROJECT}
        onClick={onNavigate}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        New Architect Design
      </Link>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-ink/[0.04] px-3 py-2.5 dark:bg-white/[0.05]">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white">
          <BarChart3 className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink/70 dark:text-white/70">
            Pro Plan
          </p>
          <p className="text-[11px] text-ink/40 dark:text-white/40">Architect</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-brand-500/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300"
                  : "text-ink/60 hover:bg-ink/[0.04] hover:text-ink dark:text-white/55 dark:hover:bg-white/[0.06] dark:hover:text-white",
              )
            }
          >
            <Icon className="size-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl border border-dashed border-ink/15 p-3 text-[11px] leading-relaxed text-ink/45 dark:border-white/15 dark:text-white/45">
        <span className="font-semibold text-ink/70 dark:text-white/70">Milestone 2</span>{" "}
        — AI blueprint generation is live. Diagrams &amp; PDF export ship next.
      </div>
    </aside>
  );
}