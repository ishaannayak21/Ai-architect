import { motion } from "framer-motion";
import { CheckCircle2, Layers, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";

const highlights = [
  "Instant requirements & database design",
  "API contracts, folder structure & architecture",
  "Mermaid diagrams, cost estimates & timelines",
];

interface AuthLayoutProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600 bg-gradient-animated" />
        <div className="absolute -left-20 -top-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to={ROUTES.HOME} className="w-fit">
            <div className="flex items-center gap-2.5 text-white">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                <Layers className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                AI Software Architect
              </span>
            </div>
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3.5" /> From idea to architecture
              </span>
              <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-tight">
                Describe your idea. Get a complete engineering blueprint.
              </h2>
              <ul className="mt-6 space-y-2.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/85">
                    <CheckCircle2 className="size-4 shrink-0 text-white/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <p className="text-xs text-white/60">
            Milestone 2 · Foundation, authentication &amp; AI blueprint generation
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-surface px-4 py-10 lg:w-1/2 dark:bg-[#05060a]">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <div className="mt-1.5 text-sm text-ink/55 dark:text-white/50">
              {subtitle}
            </div>
            <div className="mt-7">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}