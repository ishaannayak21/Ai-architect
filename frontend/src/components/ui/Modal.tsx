import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md rounded-2xl border border-[#E6DFD5] bg-[#FAF7F2] p-7 shadow-xl dark:border-[#2B3D2F] dark:bg-[#1E2B21]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 cursor-pointer rounded-lg p-1.5 text-[#6B726C] transition-colors hover:bg-[#F2ECE1] hover:text-[#1F2421] dark:text-[#A3B5A7] dark:hover:bg-[#243226] dark:hover:text-white"
              aria-label="Close"
            >
              <X className="size-4.5" />
            </button>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">{title}</h2>
            {description ? (
              <p className="mt-1.5 font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
                {description}
              </p>
            ) : null}
            <div className="mt-5">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}