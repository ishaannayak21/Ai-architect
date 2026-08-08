import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 350 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const mediaFine = window.matchMedia("(pointer: fine)");
    const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!mediaFine.matches || mediaReduced.matches) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, input, select, textarea, [role='button'], [data-cursor-label], .group",
      );
      setHovered(!!interactive);

      const labelEl = target.closest("[data-cursor-label]") as HTMLElement | null;
      if (labelEl) {
        setCursorLabel(labelEl.getAttribute("data-cursor-label"));
      } else {
        setCursorLabel(null);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Outer Spring Follower Ring with Orange Accent Glow */}
      <motion.div
        className="pointer-events-none fixed rounded-full border border-orange-500/50 bg-orange-500/5 shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all duration-200"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          width: hovered ? 42 : 26,
          height: hovered ? 42 : 26,
        }}
      />

      {/* Inner Crisp Dot */}
      <motion.div
        className="pointer-events-none fixed rounded-full bg-orange-500 transition-transform duration-150"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
          width: hovered ? 8 : 6,
          height: hovered ? 8 : 6,
        }}
      />

      {/* Floating Contextual Tooltip */}
      {cursorLabel ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none fixed rounded-md border border-orange-500/40 bg-stone-950/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-orange-400 shadow-lg backdrop-blur-xs whitespace-nowrap"
          style={{
            left: cursorX,
            top: cursorY,
            x: 16,
            y: 16,
          }}
        >
          {cursorLabel}
        </motion.div>
      ) : null}
    </div>
  );
}
