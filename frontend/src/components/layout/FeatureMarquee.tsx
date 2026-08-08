const FEATURES = [
  "AI-POWERED",
  "ARCHITECTURE GENERATOR",
  "MERMAID DIAGRAMS",
  "SMART DOCUMENTATION",
  "AI CHAT ASSISTANT",
  "EXPORT PDF / HTML / MD",
];

export function FeatureMarquee() {
  const items = [...FEATURES, ...FEATURES, ...FEATURES, ...FEATURES];

  return (
    <div className="w-full overflow-hidden border-y border-stone-200 bg-stone-100/70 py-3 dark:border-stone-800 dark:bg-[#070707]">
      <div className="group flex overflow-hidden select-none">
        <div className="flex shrink-0 animate-marquee items-center gap-6 group-hover:[animation-play-state:paused]">
          {items.map((feat, index) => (
            <div key={index} className="flex items-center gap-6">
              {index === 0 ? (
                <span className="size-2 rounded-full bg-stone-900 dark:bg-white" />
              ) : (
                <span className="text-orange-500 font-bold text-xs">✦</span>
              )}
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-800 dark:text-stone-200 whitespace-nowrap">
                {feat}
              </span>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex shrink-0 animate-marquee items-center gap-6 group-hover:[animation-play-state:paused]">
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
  );
}
