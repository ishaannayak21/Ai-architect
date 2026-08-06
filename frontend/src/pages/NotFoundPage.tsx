import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 dark:bg-[#05060a]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-72 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/20 to-violet-400/20 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <Logo className="mb-8" />
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex size-16 items-center justify-center rounded-3xl bg-brand-500/10 text-brand-500 dark:bg-brand-400/10 dark:text-brand-300"
        >
          <Compass className="size-8" />
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1 className="mt-6 bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
            404
          </h1>
          <p className="mt-3 text-lg font-medium">Page not found</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink/55 dark:text-white/50">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
            Let&apos;s get you back to building.
          </p>
          <div className="mt-7">
            <Link to={ROUTES.DASHBOARD}>
              <Button>
                <ArrowLeft className="size-4.5" />
                Back to dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}