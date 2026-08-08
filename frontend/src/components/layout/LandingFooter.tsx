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
    <footer className="border-t border-stone-200/90 bg-stone-100/50 dark:border-stone-800/90 dark:bg-stone-900/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-stone-600 dark:text-stone-400">
              Describe your idea in plain language. Get a complete, production-ready
              engineering blueprint — from database schema to deployment plan.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone-200/90 pt-6 font-mono text-xs text-stone-500 sm:flex-row dark:border-stone-800/90 dark:text-stone-500">
          <p>© {new Date().getFullYear()} AI Software Architect. All rights reserved.</p>
          <p>Built for engineers who ship.</p>
        </div>
      </div>
    </footer>
  );
}