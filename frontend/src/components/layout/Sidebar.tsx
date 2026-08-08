import {
  Crown,
  Folder,
  LayoutGrid,
  ListOrdered,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";
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

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-68 flex-col border-r border-[#E6DFD5] bg-[#FAF7F2] p-5 backdrop-blur-md dark:border-[#2B3D2F] dark:bg-[#141C16]">
      <div className="flex h-12 items-center px-1">
        <Logo />
      </div>

      <Link
        to={ROUTES.NEW_PROJECT}
        onClick={onNavigate}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#C05621] px-4 py-3 font-sans text-sm font-medium text-white shadow-2xs transition-all hover:bg-[#A8481A] active:bg-[#943F16]"
      >
        <Plus className="size-4.5" />
        New Architect Design
      </Link>

      {/* Pro Architect Card */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#E6DFD5] bg-[#FFFFFF] p-3 shadow-2xs dark:border-[#2B3D2F] dark:bg-[#1E2B21]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FDF3EE] text-[#C05621] dark:bg-[#331C13] dark:text-[#E07A48]">
          <Crown className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="font-serif text-sm font-bold text-[#1F2421] dark:text-[#E6ECE7]">
            Pro Architect
          </p>
          <p className="font-sans text-xs text-[#6B726C] dark:text-[#A3B5A7]">
            Unlimited Blueprints
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex flex-1 flex-col gap-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 font-sans text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#EFEAE2] text-[#1F2421] font-semibold dark:bg-[#243226] dark:text-white"
                  : "text-[#4A524C] hover:bg-[#F2ECE1] hover:text-[#1F2421] dark:text-[#A3B5A7] dark:hover:bg-[#1E2B21] dark:hover:text-[#E6ECE7]",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#223829] dark:bg-[#A3B5A7]" />
                ) : null}
                <Icon className="size-4.5" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Forest Green System Status Card with Architectural Line Art */}
      <div className="relative overflow-hidden rounded-2xl bg-[#283C2D] p-4 text-white shadow-md dark:bg-[#1C2C20]">
        <div className="relative z-10">
          <p className="font-mono text-xs font-semibold text-[#E8F0EA] tracking-wide mb-1">
            [ v2.0 System ]
          </p>
          <p className="font-sans text-xs leading-relaxed text-[#A3B5A7]">
            Modern-Retro Blueprint Engine &amp; AI Architect ready.
          </p>
        </div>
        {/* Subtle Architectural Wireframe Line Art Graphic */}
        <svg
          aria-hidden="true"
          className="absolute -right-2 -bottom-2 size-24 text-[#3E5C46] opacity-35 pointer-events-none"
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
    </aside>
  );
}