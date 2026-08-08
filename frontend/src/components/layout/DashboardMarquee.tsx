import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useState } from "react";

const FEATURES = [
  "AI-POWERED",
  "ARCHITECTURE GENERATOR",
  "MERMAID DIAGRAMS",
  "SMART DOCUMENTATION",
  "AI CHAT ASSISTANT",
  "EXPORT PDF / HTML / MD",
];

export function DashboardMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const items = [...FEATURES, ...FEATURES, ...FEATURES, ...FEATURES];

  return (
    <div className="flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 dark:border-stone-800/80 dark:bg-[#111111]">
      <div className="flex-1 overflow-hidden select-none">
        <div className="group flex overflow-hidden">
          <div
            className={`flex shrink-0 animate-marquee items-center gap-6 ${
              isPaused ? "[animation-play-state:paused]" : "group-hover:[animation-play-state:paused]"
            }`}
          >
            {items.map((feat, index) => (
              <div key={index} className="flex items-center gap-6">
                <span className="text-orange-500 font-bold text-xs">✦</span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-800 dark:text-stone-200 whitespace-nowrap">
                  {feat}
                </span>
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className={`flex shrink-0 animate-marquee items-center gap-6 ${
              isPaused ? "[animation-play-state:paused]" : "group-hover:[animation-play-state:paused]"
            }`}
          >
            {items.map((feat, index) => (
              <div key={`dup-${index}`} className="flex items-center gap-6">
                <span className="text-orange-500 font-bold text-xs">✦</span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-800 dark:text-stone-200 whitespace-nowrap">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Far right controls matching screenshot */}
      <div className="hidden sm:flex items-center gap-1 shrink-0 border-l border-stone-200 pl-3 dark:border-stone-800">
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white transition-colors"
          title={isPaused ? "Play marquee" : "Pause marquee"}
        >
          {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </button>
        <div className="flex items-center text-stone-500">
          <ChevronLeft className="size-3.5" />
          <ChevronRight className="size-3.5" />
        </div>
      </div>
    </div>
  );
}
