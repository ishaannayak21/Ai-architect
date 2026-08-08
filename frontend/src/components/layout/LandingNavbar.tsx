import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ROUTES } from "@/constants";

const navItems = [
  { label: "HOME", num: "01", href: "#home" },
  { label: "ABOUT", num: "02", href: "#about" },
  { label: "PROJECTS", num: "03", href: "#projects" },
  { label: "FEATURES", num: "04", href: "#features" },
  { label: "TECH STACK", num: "05", href: "#tech-stack" },
  { label: "CONTACT", num: "06", href: "#contact" },
];

function HeaderClock() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour12: false });
      setTimeStr(`NAVI MUMBAI · ${time} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block font-mono text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 select-none">
      {timeStr}
    </div>
  );
}

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md dark:border-stone-800/80 dark:bg-[#080808]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to={ROUTES.HOME} className="shrink-0">
          <Logo />
        </Link>

        {/* Center Compact Superscript Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ label, num, href }) => (
            <a
              key={label}
              href={href}
              className="group inline-flex items-start gap-1 font-mono text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
            >
              <span>{label}</span>
              <sup className="font-mono text-[9px] font-bold text-orange-500 transition-transform group-hover:-translate-y-0.5">
                {num}
              </sup>
            </a>
          ))}

          {/* Oval Outlined Dashboard Button */}
          <Link
            to={ROUTES.DASHBOARD}
            className="ml-2 inline-flex items-center rounded-full border border-orange-500/80 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-orange-500 transition-all hover:bg-orange-500 hover:text-white dark:border-orange-500/90 dark:text-orange-500 dark:hover:bg-orange-500 dark:hover:text-white"
          >
            DASHBOARD
          </Link>
        </nav>

        {/* Right Side: Location/Time & Theme */}
        <div className="flex items-center gap-4">
          <HeaderClock />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}