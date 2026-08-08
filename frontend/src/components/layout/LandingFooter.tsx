import { Link } from "react-router-dom";

import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";

const columns = [
  {
    title: "PRODUCT",
    links: [
      { label: "FEATURES", href: "#features" },
      { label: "HOW IT WORKS", href: "#about" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { label: "SIGN IN", href: ROUTES.LOGIN },
      { label: "REGISTER", href: ROUTES.REGISTER },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "DASHBOARD", href: ROUTES.DASHBOARD },
      { label: "PROJECTS", href: ROUTES.PROJECTS },
      { label: "SETTINGS", href: ROUTES.SETTINGS },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white py-12 dark:border-stone-800 dark:bg-[#060606]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              AI-powered software architecture platform turning ideas into complete engineering blueprints.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:text-orange-500 dark:text-stone-400 dark:hover:text-orange-500"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:text-orange-500 dark:text-stone-400 dark:hover:text-orange-500"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-8 font-mono text-xs text-stone-500 sm:flex-row dark:border-stone-800 dark:text-stone-500">
          <p>© {new Date().getFullYear()} AI SOFTWARE ARCHITECT. ALL RIGHTS RESERVED.</p>
          <p className="text-orange-500">BUILT FOR ENGINEERS WHO SHIP</p>
        </div>
      </div>
    </footer>
  );
}