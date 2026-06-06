"use client";

import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useId,useRef, useState } from "react";

interface MermaidProps {
  value: string;
}

export default function Mermaid({ value }: MermaidProps) {
  const elementId = useId().replace(/:/g, ""); // Remove colons from react useId to make it a valid CSS/HTML identifier
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Lightbox / Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          darkMode: false, // Prevent adapting to system dark mode settings
          securityLevel: "loose",
          themeVariables: {
            fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            // Force strict light mode theme values for readability on white/light backgrounds
            background: "#f8fafc",
            primaryColor: "#f1f5f9",
            primaryTextColor: "#0f172a",
            primaryBorderColor: "#cbd5e1",
            lineColor: "#64748b",
            secondaryColor: "#f1f5f9",
            tertiaryColor: "#f8fafc",
            nodeBorder: "#cbd5e1",
            mainBkg: "#f1f5f9",
            actorBorder: "#cbd5e1",
            actorBkg: "#f1f5f9",
            actorTextColor: "#0f172a",
            signalColor: "#64748b",
            signalTextColor: "#0f172a",
            labelBoxBkgColor: "#f1f5f9",
            labelBoxBorderColor: "#cbd5e1",
            labelTextColor: "#0f172a",
            loopTextColor: "#0f172a",
            noteBorderColor: "#cbd5e1",
            noteBkgColor: "#fef08a", // Soft yellow for notes
            noteTextColor: "#0f172a",
          },
        });

        const id = `mermaid-${elementId}`;
        const { svg: renderedSvg } = await mermaid.render(id, value);
        
        if (active) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        console.error("Mermaid parsing/rendering error:", err);
        if (active) {
          setError("Failed to render diagram. Please check your Mermaid syntax.");
        }
      }
    }

    renderDiagram();

    return () => {
      active = false;
    };
  }, [value, elementId]);

  // Handle zooming in/out
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 4));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const direction = e.deltaY < 0 ? 1 : -1;
    setScale((s) => {
      const nextScale = s + direction * zoomFactor;
      return Math.max(0.5, Math.min(nextScale, 4));
    });
  };

  // Dragging / Panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile zooming/panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Open modal
  const openLightbox = () => {
    setIsOpen(true);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    document.body.style.overflow = "hidden"; // Prevent body scroll
  };

  // Close modal
  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = ""; // Re-enable body scroll
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (error) {
    return (
      <div className="not-prose my-8 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm font-mono whitespace-pre-wrap">
        {error}
        <pre className="mt-2 text-xs text-red-650 opacity-80">{value}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="not-prose my-8 flex items-center justify-center p-8 rounded-xl border border-slate-100 bg-slate-50/50 animate-pulse">
        <span className="text-sm text-slate-400 font-mono">rendering diagram...</span>
      </div>
    );
  }

  return (
    <>
      {/* Inline View */}
      <div className="not-prose relative my-8 group border border-slate-200/60 rounded-xl bg-slate-50/30 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Hover overlay button to expand */}
        <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={openLightbox}
            title="Expand and zoom diagram"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white/95 text-slate-600 hover:text-slate-900 shadow-sm hover:shadow-md backdrop-blur-sm cursor-pointer transition-all text-xs font-medium"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>zoom/expand</span>
          </button>
        </div>

        {/* Diagram container */}
        <div 
          onClick={openLightbox}
          className="flex justify-center p-6 overflow-x-auto cursor-zoom-in active:cursor-grabbing select-none [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Full-Screen Lightbox Modal */}
      {isOpen && (
        <div className="not-prose fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-xl animate-fade-in">
          {/* Top bar controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <span className="text-sm font-mono text-slate-500">agentic chaos engineering - diagram viewer</span>
            <button
              onClick={closeLightbox}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200/55"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Zoom/Pan Canvas */}
          <div
            ref={viewerRef}
            className={`flex-1 relative overflow-hidden select-none flex items-center justify-center ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {/* The SVG Container */}
            <div
              className="flex justify-center items-center select-none w-full max-w-3xl px-6 [&>svg]:!max-w-full [&>svg]:!h-auto"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>

          {/* Bottom Zoom & Reset Controls */}
          <div className="flex justify-center pb-8 pt-4">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/90 border border-slate-200 shadow-xl shadow-slate-100/50 backdrop-blur-md">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer border border-slate-200/50"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-700 px-2 min-w-16 text-center select-none">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer border border-slate-200/50"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/50"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
