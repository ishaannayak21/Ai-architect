import {
  Crown,
  Folder,
  LayoutGrid,
  ListOrdered,
  LogOut,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const navItems = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutGrid },
  { to: ROUTES.PROJECTS, label: "Projects", icon: Folder },
  { to: ROUTES.BLUEPRINTS, label: "Project History", icon: ListOrdered },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
  { to: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

function SidebarUserAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-600 font-sans text-xs font-bold text-white shadow-2xs border border-orange-500">
      {initials}
    </span>
  );
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="flex h-full w-68 flex-col border-r border-stone-200 bg-white p-5 backdrop-blur-md dark:border-stone-800 dark:bg-[#090909]">
      <div className="flex h-12 items-center px-1">
        <Logo />
      </div>

      <Link
        to={ROUTES.NEW_PROJECT}
        onClick={onNavigate}
        data-cursor-label="Generate Blueprint"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition-all hover:bg-orange-500 active:bg-orange-700"
      >
        <Plus className="size-4.5" />
        NEW ARCHITECT DESIGN
      </Link>

      {/* Pro Architect Card */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800/80 dark:bg-[#121212]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
          <Crown className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="font-sans text-sm font-bold text-stone-900 dark:text-white">
            Pro Architect
          </p>
          <p className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
            Unlimited Blueprints
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-5 flex flex-1 flex-col gap-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 font-sans text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-stone-100 text-stone-900 font-semibold dark:bg-[#181818] dark:text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-[#141414] dark:hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-orange-500" />
                ) : null}
                <Icon className="size-4.5" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Status Panel */}
      <div className="relative overflow-hidden rounded-2xl bg-stone-900 p-4 text-white shadow-md dark:bg-[#121212] border border-stone-800/80 mb-4">
        <div className="relative z-10">
          <p className="font-mono text-xs font-bold text-orange-500 tracking-wide mb-1">
            [ v2.0 SYSTEM ONLINE ]
          </p>
          <p className="font-sans text-xs leading-relaxed text-stone-400">
            AI Blueprint &amp; Architecture Engine active.
          </p>
        </div>
        <svg
          aria-hidden="true"
          className="absolute -right-2 -bottom-2 size-24 text-orange-500/20 pointer-events-none"
          fill="none"
          viewBox="0 0 100 100"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M10 80 L50 20 L90 80 Z" />
          <path d="M10 80 L50 60 L90 80" />
          <path d="M50 20 L50 60" />
          <path d="M30 50 L70 50" />
          <path d="M20 65 L80 65" />
          <line x1="0" y1="90" x2="100" y2="90" />
        </svg>
      </div>

      {/* User Profile Section at bottom of Sidebar */}
      {user ? (
        <div className="flex items-center justify-between gap-2.5 rounded-xl border border-stone-200 bg-stone-50 p-2.5 dark:border-stone-800 dark:bg-[#121212]">
          <div className="flex items-center gap-2.5 min-w-0">
            <SidebarUserAvatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-xs font-bold text-stone-900 dark:text-white">
                {user.name}
              </p>
              <p className="truncate font-mono text-[10px] text-stone-500 dark:text-stone-400">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition-colors hover:bg-orange-600 hover:text-white dark:border-stone-800 dark:bg-[#1a1a1a] dark:text-stone-300 dark:hover:bg-orange-600 dark:hover:text-white"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}