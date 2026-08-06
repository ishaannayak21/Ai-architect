import { useEffect, useRef, useState } from "react";

import { AlertTriangle, Loader2 } from "lucide-react";
import mermaid from "mermaid";

import { cn } from "@/utils/cn";

type RenderStatus = "loading" | "ready" | "error";

type Theme = "light" | "dark";

function getDomTheme(): Theme {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

export interface MermaidDiagramProps {
  code: string;
  className?: string;
  onRender?: (svg: SVGSVGElement | null) => void;
  onError?: (message: string) => void;
}

let renderCounter = 0;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function MermaidDiagram({
  code,
  className,
  onRender,
  onError,
}: MermaidDiagramProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onRenderRef = useRef(onRender);
  const onErrorRef = useRef(onError);
  const [theme, setTheme] = useState<Theme>(getDomTheme);
  const [status, setStatus] = useState<RenderStatus>(() =>
    code ? "loading" : "ready",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  onRenderRef.current = onRender;
  onErrorRef.current = onError;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getDomTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!code) {
        setStatus("ready");
        onRenderRef.current?.(null);
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      try {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          fontFamily:
            '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          theme: theme === "dark" ? "dark" : "default",
          themeVariables: {
            background: "transparent",
            primaryColor: "transparent",
            primaryTextColor: theme === "dark" ? "#f4f5f7" : "#0a0a0f",
            primaryBorderColor: theme === "dark" ? "#3b5bfb" : "#3b5bfb",
            lineColor: theme === "dark" ? "#8aaafe" : "#5b83fd",
            secondaryColor: "transparent",
          },
          flowchart: { htmlLabels: false },
          class: { htmlLabels: false },
        });

        await mermaid.parse(code);

        const renderId = `mmd-diagram-${renderCounter++}`;
        const { svg } = await mermaid.render(renderId, code);

        if (cancelled) {
          return;
        }

        const container = containerRef.current;
        if (container) {
          container.innerHTML = svg;
        }
        setStatus("ready");
        const svgEl = container?.querySelector("svg") ?? null;
        onRenderRef.current?.(svgEl as SVGSVGElement | null);
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message = getErrorMessage(error);
        setStatus("error");
        setErrorMessage(message);
        onRenderRef.current?.(null);
        onErrorRef.current?.(message);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code, theme]);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {status === "loading" ? (
        <div className="flex min-h-48 items-center justify-center text-ink/40 dark:text-white/40">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-center">
          <AlertTriangle className="size-7 text-amber-500" />
          <p className="text-sm font-medium text-ink/70 dark:text-white/70">
            We couldn't render this diagram.
          </p>
          <p className="max-w-sm text-xs text-ink/45 dark:text-white/45">
            The Mermaid syntax may be invalid or unsupported. Use the regenerate
            action to create a new version of this diagram.
          </p>
          <p className="max-h-16 w-full overflow-auto rounded-lg bg-ink/[0.04] p-2 font-mono text-[10px] text-red-500/80 dark:bg-white/[0.05]">
            {errorMessage}
          </p>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          "mermaid-scope flex items-center justify-center",
          status !== "ready" && "hidden",
        )}
      />
    </div>
  );
}