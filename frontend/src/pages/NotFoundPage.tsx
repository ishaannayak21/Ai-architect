import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ROUTES } from "@/constants";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8F5EE] px-6 text-[#1F2421] dark:bg-[#141C16] dark:text-[#E6ECE7]">
      <div className="relative flex flex-col items-center text-center">
        <Logo className="mb-8" />
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex size-16 items-center justify-center rounded-3xl border border-[#C5D8C9] bg-[#E8F0EA] font-bold text-[#223829] dark:border-[#38503E] dark:bg-[#243226] dark:text-[#A3B5A7]"
        >
          <Compass className="size-8" />
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1 className="mt-6 font-serif text-8xl font-black tracking-tight text-[#C05621] dark:text-[#E07A48]">
            404
          </h1>
          <p className="mt-3 font-serif text-3xl font-bold tracking-tight">Page Not Found</p>
          <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7] leading-relaxed">
            The architectural blueprint or page you are searching for does not exist or has been relocated.
          </p>
          <div className="mt-8">
            <Link to={ROUTES.DASHBOARD}>
              <Button size="lg">
                <ArrowLeft className="size-4.5" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}