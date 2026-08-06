import { useCallback, useEffect, useRef, useState } from "react";

import {
  Copy,
  Download,
  ImageDown,
  Maximize2,
  Minimize,
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import {
  copyText,
  diagramFilename,
  downloadPng,
  downloadSvg,
} from "@/utils/diagramExport";

const MIN_SCALE = 0.3;
const MAX_SCALE = 4;
const SCALE_STEP = 0.25;

interface DiagramViewerProps {
  code: string;
  diagramType: string;
  filenamePrefix: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRegenerate?: () => Promise<void> | void;
  isRegenerating?: boolean;
}

interface Size {
  width: number;
  height: number;
}

function svgNaturalSize(svg: SVGSVGElement): Size {
  const viewBox = svg.viewBox?.baseVal;
  if (viewBox && viewBox.width && viewBox.height) {
    return { width: viewBox.width, height: viewBox.height };
  }
  const rect = svg.getBoundingClientRect();
  return { width: rect.width || 600, height: rect.height || 400 };
}

export function DiagramViewer({
  code,
  diagramType,
  filenamePrefix,
  isFullscreen,
  onToggleFullscreen,
  onRegenerate,
  isRegenerating,
}: DiagramViewerProps) {
  const [scale, setScale] = useState(1);
  const [size, setSize] = useState<Size | null>(null);
  const [autoFitted, setAutoFitted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleRender = useCallback((svg: SVGSVGElement | null) => {
    svgRef.current = svg;
    setSize(svg ? svgNaturalSize(svg) : null);
  }, []);

  useEffect(() => {
    if (!size || autoFitted) {
      return;
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const availableWidth = container.clientWidth;
    if (availableWidth > 0 && size.width > availableWidth) {
      setScale(Math.max(MIN_SCALE, availableWidth / size.width));
    }
    setAutoFitted(true);
  }, [size, autoFitted]);

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP));
  const resetZoom = () => setScale(1);

  const handleCopy = async () => {
    try {
      await copyText(code);
      toast.success("Mermaid code copied to clipboard");
    } catch {
      toast.error("Couldn't copy the Mermaid code");
    }
  };

  const handleDownloadSvg = () => {
    const svg = svgRef.current;
    if (!svg) {
      toast.error("The diagram isn't ready to export yet");
      return;
    }
    downloadSvg(svg, `${diagramFilename(filenamePrefix, diagramType)}.svg`);
    toast.success("SVG downloaded");
  };

  const handleDownloadPng = () => {
    const svg = svgRef.current;
    if (!svg) {
      toast.error("The diagram isn't ready to export yet");
      return;
    }
    downloadPng(svg, `${diagramFilename(filenamePrefix, diagramType)}.png`);
    toast.success("PNG downloaded");
  };

  const atMin = scale <= MIN_SCALE;
  const atMax = scale >= MAX_SCALE;

  const toolbarButton =
    "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:text-white/60 dark:hover:bg-white/[0.08] dark:hover:text-white";

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className="mermaid-scroll overflow-auto border-b border-ink/10 bg-white p-4 dark:border-white/10 dark:bg-[#0b0e14]"
        style={{ maxHeight: isFullscreen ? "calc(100vh - 180px)" : "62vh" }}
      >
        <div
          style={{
            width: size ? size.width * scale : "100%",
            height: size ? size.height * scale : undefined,
          }}
        >
          <div
            style={{
              width: size ? size.width : undefined,
              height: size ? size.height : undefined,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            <MermaidDiagram code={code} onRender={handleRender} />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-1 px-3 py-2",
          isFullscreen
            ? "border-t border-ink/10 bg-white/60 dark:border-white/10 dark:bg-white/[0.02]"
            : "rounded-b-2xl",
        )}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={toolbarButton}
            onClick={zoomOut}
            disabled={atMin}
            title="Zoom out"
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            className={cn(toolbarButton, "w-12 text-xs font-medium")}
            onClick={resetZoom}
            title="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={zoomIn}
            disabled={atMax}
            title="Zoom in"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <div className="mx-1 h-5 w-px bg-ink/10 dark:bg-white/10" />

        <button
          type="button"
          className={toolbarButton}
          onClick={handleCopy}
          title="Copy Mermaid code"
        >
          <Copy className="size-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-ink/10 dark:bg-white/10" />

        <button
          type="button"
          className={toolbarButton}
          onClick={handleDownloadPng}
          title="Download PNG"
        >
          <ImageDown className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={handleDownloadSvg}
          title="Download SVG"
        >
          <Download className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </button>

        {onRegenerate ? (
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              loading={isRegenerating}
              onClick={() => onRegenerate()}
            >
              <RefreshCw className="size-3.5" />
              Regenerate
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}