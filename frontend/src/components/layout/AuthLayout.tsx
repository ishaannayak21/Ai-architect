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
    <div className="flex min-h-screen bg-[#F8F5EE] text-[#1F2421] dark:bg-[#141C16] dark:text-[#E6ECE7]">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden border-r border-[#344A39] bg-[#1C2C20] lg:block">
        <div className="absolute -left-20 -top-20 size-96 rounded-full bg-[#223829]/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[28rem] rounded-full bg-[#C05621]/15 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to={ROUTES.HOME} className="w-fit">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl border border-[#344A39] bg-[#233527] text-white">
                <Layers className="size-5 text-[#E8F0EA]" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  AI Software Architect
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#A3B5A7] font-semibold">
                  ENGINEERING BLUEPRINT
                </span>
              </div>
            </div>
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5D8C9]/30 bg-[#E8F0EA]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#E8F0EA]">
                <Sparkles className="size-3.5 text-[#E07A48]" /> FROM IDEA TO ARCHITECTURE
              </span>
              <h2 className="mt-5 max-w-md font-serif text-3xl font-bold leading-tight tracking-tight text-white">
                Describe your idea. Get a complete engineering blueprint.
              </h2>
              <ul className="mt-6 space-y-3.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#A3B5A7]">
                    <CheckCircle2 className="size-4 shrink-0 text-[#E07A48]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <p className="font-mono text-xs text-[#A3B5A7]">
            System v2.0 · Security, Auth &amp; AI Architect Ready
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-[#F8F5EE] px-6 py-12 text-[#1F2421] dark:bg-[#141C16] dark:text-[#E6ECE7] lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">{title}</h1>
            <div className="mt-2 text-sm text-[#6B726C] dark:text-[#A3B5A7]">
              {subtitle}
            </div>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}