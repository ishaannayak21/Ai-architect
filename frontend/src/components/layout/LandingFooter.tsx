import { Link } from "react-router-dom";

import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";

const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: ROUTES.LOGIN },
      { label: "Create account", href: ROUTES.REGISTER },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Dashboard", href: ROUTES.DASHBOARD },
      { label: "Projects", href: ROUTES.PROJECTS },
      { label: "Settings", href: ROUTES.SETTINGS },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white/40 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-ink/55 dark:text-white/50">
              Describe your idea in plain language. Get a complete, production-ready
              engineering blueprint — from database schema to deployment plan.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-ink/55 transition-colors hover:text-ink dark:text-white/50 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-ink/40 sm:flex-row dark:border-white/10 dark:text-white/40">
          <p>© {new Date().getFullYear()} AI Software Architect. All rights reserved.</p>
          <p>Built for engineers who ship.</p>
        </div>
      </div>
    </footer>
  );
}