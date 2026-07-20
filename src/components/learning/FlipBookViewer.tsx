"use client";

import React, { useEffect, useState, useRef } from "react";

interface FlipBookViewerProps {
  pdfUrl: string;
  title?: string;
  subjectName?: string;
}

export default function FlipBookViewer({
  pdfUrl,
  title = "Chapter Notes",
  subjectName = "Study Material",
}: FlipBookViewerProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 1-based page index
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [zoom, setZoom] = useState<number>(1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Synthesized paper flip sound effect
  const playFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.24));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.18);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio context safe catch
    }
  };

  // Load PDFJS and render PDF pages into images
  useEffect(() => {
    let isMounted = true;

    async function renderPdfPages() {
      setLoading(true);
      setError(null);
      setLoadingProgress(5);

      try {
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PDF rendering library"));
            document.head.appendChild(script);
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          throw new Error("PDF Library missing");
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        setLoadingProgress(20);

        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        const total = pdf.numPages;

        if (!isMounted) return;

        const renderedImages: string[] = [];

        for (let i = 1; i <= total; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.8 });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
            const imgData = canvas.toDataURL("image/webp", 0.92);
            renderedImages.push(imgData);
          }

          if (!isMounted) return;
          setLoadingProgress(Math.round(20 + (i / total) * 80));
        }

        setPages(renderedImages);
        setLoading(false);
      } catch (err: any) {
        console.error("Error rendering PDF for Flip Book:", err);
        if (isMounted) {
          setError(err.message || "Failed to render PDF Flip Book");
          setLoading(false);
        }
      }
    }

    if (pdfUrl) {
      void renderPdfPages();
    }

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  const totalPages = pages.length;

  const handleNext = () => {
    if (isFlipping) return;

    if (currentPage < totalPages) {
      setIsFlipping(true);
      setFlipDirection("next");
      playFlipSound();

      setTimeout(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 950);
    }
  };

  const handlePrev = () => {
    if (isFlipping) return;

    if (currentPage > 1) {
      setIsFlipping(true);
      setFlipDirection("prev");
      playFlipSound();

      setTimeout(() => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 950);
    }
  };

  const handleJumpToPage = (pg: number) => {
    if (pg >= 1 && pg <= totalPages && !isFlipping) {
      setIsFlipping(true);
      playFlipSound();
      setTimeout(() => {
        setCurrentPage(pg);
        setIsFlipping(false);
      }, 450);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, isFlipping]);

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`bg-slate-950 text-white rounded-3xl p-2 md:p-3 shadow-2xl border border-slate-800 relative overflow-hidden select-none flex flex-col justify-between space-y-2 transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen p-4" : "w-full h-full min-h-0 flex-1"
      }`}
    >
      {/* 3D Multi-Segment Page-Turn Easing & Dynamic Shadow Animations */}
      <style jsx global>{`
        .perspective-3200 {
          perspective: 3200px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Spine Panel (left half) rotating leftwards */
        .flip-leaf-next {
          animation: leafFlipNext 0.95s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          transform-origin: left center;
        }

        /* Flap Panel (right half) folding relative to Spine Panel */
        .flip-leaf-next-flap {
          animation: leafFlipNextFlap 0.95s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          transform-origin: left center;
        }

        /* Spine Panel rotating back from left */
        .flip-leaf-prev {
          animation: leafFlipPrev 0.95s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          transform-origin: left center;
        }

        /* Flap Panel folding relative to Spine Panel during back flip */
        .flip-leaf-prev-flap {
          animation: leafFlipPrevFlap 0.95s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          transform-origin: left center;
        }

        @keyframes leafFlipNext {
          0% {
            transform: translateZ(0px) rotateY(0deg) rotateX(0deg) scale(1) translateX(0);
          }
          35% {
            transform: translateZ(280px) rotateY(-65deg) rotateX(10deg) scale(0.9);
          }
          70% {
            transform: translateZ(240px) rotateY(-125deg) rotateX(6deg) scale(0.9);
          }
          100% {
            transform: translateZ(0px) rotateY(-180deg) rotateX(0deg) scale(1) translateX(0);
          }
        }

        @keyframes leafFlipNextFlap {
          0% {
            transform: rotateY(0deg);
          }
          35% {
            /* Folds back to form the curved bend shape */
            transform: rotateY(38deg) skewY(-2deg) scaleX(0.92);
          }
          70% {
            /* Continues folding/skewing */
            transform: rotateY(34deg) skewY(2deg) scaleX(0.92);
          }
          100% {
            /* Flattens out on the left */
            transform: rotateY(0deg);
          }
        }

        @keyframes leafFlipPrev {
          0% {
            transform: translateZ(0px) rotateY(-180deg) rotateX(0deg) scale(1) translateX(0);
          }
          35% {
            transform: translateZ(280px) rotateY(-125deg) rotateX(10deg) scale(0.9);
          }
          70% {
            transform: translateZ(240px) rotateY(-65deg) rotateX(6deg) scale(0.9);
          }
          100% {
            transform: translateZ(0px) rotateY(0deg) rotateX(0deg) scale(1) translateX(0);
          }
        }

        @keyframes leafFlipPrevFlap {
          0% {
            transform: rotateY(0deg);
          }
          35% {
            transform: rotateY(38deg) skewY(-2deg) scaleX(0.92);
          }
          70% {
            transform: rotateY(34deg) skewY(2deg) scaleX(0.92);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        /* Light sweep reflection effect */
        .light-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.02) 30%,
            rgba(255,255,255,0.22) 50%,
            rgba(255,255,255,0.02) 70%,
            rgba(255,255,255,0) 100%
          );
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: overlay;
        }

        .flip-leaf-next .light-sweep,
        .flip-leaf-prev .light-sweep {
          animation: sweepActive 0.95s linear forwards;
        }

        @keyframes sweepActive {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* Ambient page curl shadow on background */
        .ambient-fold-shadow {
          position: absolute;
          inset: 0;
          background-color: rgba(0,0,0,0.45);
          pointer-events: none;
          z-index: 3;
          opacity: 0;
        }

        .fold-shadow-active {
          animation: shadowPulse 0.95s ease-in-out forwards;
        }

        @keyframes shadowPulse {
          0% { opacity: 0; }
          40% { opacity: 0.38; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Top Compact Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold shadow-inner">
            <span className="material-symbols-outlined text-base">book</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-wider font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                Single Page Reader
              </span>
              {subjectName && <span className="text-[11px] text-slate-400 font-medium">· {subjectName}</span>}
            </div>
            <h3 className="font-bold text-xs md:text-sm text-slate-100 truncate max-w-md">{title}</h3>
          </div>
        </div>

        {/* Reader Controls Toolbar */}
        <div className="flex items-center gap-1.5">
          {/* Fit Mode Toggle */}
          <button
            onClick={() => setFitMode(fitMode === "cover" ? "contain" : "cover")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Toggle Fit Page vs Fill View"
          >
            <span className="material-symbols-outlined text-[15px]">
              {fitMode === "cover" ? "aspect_ratio" : "fit_screen"}
            </span>
            <span className="hidden sm:inline text-[11px]">{fitMode === "cover" ? "Fill Diary" : "Fit Page"}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[15px]">zoom_out</span>
            </button>
            <span className="text-[10px] font-mono font-bold px-1.5 text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.1))}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[15px]">zoom_in</span>
            </button>
          </div>

          {/* Thumbnails Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showThumbnails
                ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">grid_view</span>
            <span className="hidden sm:inline text-[11px]">Pages</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Full-Bleed Page Stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-0 bg-slate-950 rounded-2xl border border-slate-900/80">
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 py-16 z-30">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-xl animate-pulse">
                <span className="material-symbols-outlined text-3xl text-white">menu_book</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-sm text-slate-100">Rendering Diary Page...</h4>
              <p className="text-xs text-slate-400 font-medium">Preparing wide landscape slides</p>
            </div>

            <div className="w-56 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold">{loadingProgress}% Complete</span>
          </div>
        )}

        {/* Error Fallback */}
        {error && !loading && (
          <div className="w-full flex flex-col items-center justify-center space-y-3 py-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div className="space-y-0.5 max-w-md">
              <h4 className="font-bold text-sm text-slate-200">Standard Viewer Mode</h4>
              <p className="text-xs text-slate-400">External PDF loaded in standard preview frame.</p>
            </div>
            <div className="w-full h-full min-h-[450px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <iframe src={pdfUrl} className="w-full h-full border-0" title="PDF Document" />
            </div>
          </div>
        )}

        {/* REALISTIC MULTI-SEGMENT BENDING 3D FLIP CONTAINER */}
        {!loading && !error && pages.length > 0 && (
          <div
            className="perspective-3200 transition-transform duration-300 flex items-center justify-center w-full h-full p-0"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Main Page Sheet Frame */}
            <div
              className="relative flex items-center justify-center bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 p-0 transition-all w-full h-full"
            >
              {/* Single Page Board */}
              <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                
                {/* STATIC BASE/Reveal Page (The page shown underneath the turning page) */}
                <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center overflow-hidden">
                  {isFlipping ? (
                    flipDirection === "next" ? (
                      currentPage < totalPages ? (
                        <img
                          src={pages[currentPage]} // next page
                          alt="Next Page Behind"
                          className={`w-full h-full bg-white ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                        />
                      ) : null
                    ) : (
                      currentPage > 1 ? (
                        <img
                          src={pages[currentPage - 2]} // previous page
                          alt="Prev Page Behind"
                          className={`w-full h-full bg-white ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                        />
                      ) : null
                    )
                  ) : (
                    <img
                      src={pages[currentPage - 1]} // current page
                      alt={`Page ${currentPage}`}
                      className={`w-full h-full bg-white ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                    />
                  )}

                  {/* Ambient dynamic shadow for underneath page while page is folding over it */}
                  <div className={`ambient-fold-shadow ${isFlipping ? "fold-shadow-active" : ""}`} />

                  <span className="absolute bottom-2.5 right-3.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-100/90 border border-slate-200 px-2 py-0.5 rounded shadow-sm z-10">
                    Page {isFlipping ? (flipDirection === "next" ? currentPage + 1 : currentPage - 1) : currentPage}
                  </span>
                </div>

                {/* 3D DUAL-SIDED TURNING WHOLE SHEET - NEXT: Right to Left 0 to -180 deg */}
                {isFlipping && flipDirection === "next" && (
                  /* Spine Panel (Left Half) */
                  <div className="absolute left-0 top-0 w-1/2 h-full z-40 transform-style-3d flip-leaf-next pointer-events-none">
                    {/* Front side of Spine Panel (Current Left Half) */}
                    <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden">
                      {pages[currentPage - 1] && (
                        <img
                          src={pages[currentPage - 1]}
                          alt="Left half current page"
                          className={`absolute left-0 top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-white/5 to-black/10" />
                    </div>

                    {/* Back side of Spine Panel (Next Left Half rotated) */}
                    <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden [transform:rotateY(180deg)]">
                      {pages[currentPage] && (
                        <img
                          src={pages[currentPage]}
                          alt="Left half next page"
                          className={`absolute left-0 top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-white/5 to-black/10" />
                    </div>

                    {/* Flap Panel (Right Half attached to the Spine Panel right edge) */}
                    <div className="absolute left-full top-0 w-full h-full transform-style-3d flip-leaf-next-flap">
                      {/* Front side of Flap Panel (Current Right Half) */}
                      <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden">
                        {pages[currentPage - 1] && (
                          <img
                            src={pages[currentPage - 1]}
                            alt="Right half current page"
                            className={`absolute left-[-100%] top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                          />
                        )}
                        <div className="light-sweep" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-white/5 to-black/20" />
                      </div>

                      {/* Back side of Flap Panel (Next Right Half rotated) */}
                      <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden [transform:rotateY(180deg)]">
                        {pages[currentPage] && (
                          <img
                            src={pages[currentPage]}
                            alt="Right half next page"
                            className={`absolute left-[-100%] top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                          />
                        )}
                        <div className="light-sweep" />
                        <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-white/5 to-black/20" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3D DUAL-SIDED TURNING WHOLE SHEET - PREV: Left to Right -180 to 0 deg */}
                {isFlipping && flipDirection === "prev" && (
                  /* Spine Panel (Left Half) */
                  <div className="absolute left-0 top-0 w-1/2 h-full z-40 transform-style-3d flip-leaf-prev pointer-events-none">
                    {/* Front side of Spine Panel (Previous Left Half) */}
                    <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden">
                      {pages[currentPage - 2] && (
                        <img
                          src={pages[currentPage - 2]}
                          alt="Left half previous page"
                          className={`absolute left-0 top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-white/5 to-black/10" />
                    </div>

                    {/* Back side of Spine Panel (Current Left Half rotated) */}
                    <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden [transform:rotateY(180deg)]">
                      {pages[currentPage - 1] && (
                        <img
                          src={pages[currentPage - 1]}
                          alt="Left half current page"
                          className={`absolute left-0 top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-white/5 to-black/10" />
                    </div>

                    {/* Flap Panel (Right Half attached to the Spine Panel right edge) */}
                    <div className="absolute left-full top-0 w-full h-full transform-style-3d flip-leaf-prev-flap">
                      {/* Front side of Flap Panel (Previous Right Half) */}
                      <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden">
                        {pages[currentPage - 2] && (
                          <img
                            src={pages[currentPage - 2]}
                            alt="Right half previous page"
                            className={`absolute left-[-100%] top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                          />
                        )}
                        <div className="light-sweep" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-white/5 to-black/20" />
                      </div>

                      {/* Back side of Flap Panel (Current Right Half rotated) */}
                      <div className="absolute inset-0 w-full h-full bg-white backface-hidden overflow-hidden [transform:rotateY(180deg)]">
                        {pages[currentPage - 1] && (
                          <img
                            src={pages[currentPage - 1]}
                            alt="Right half current page"
                            className={`absolute left-[-100%] top-0 w-[200%] h-full max-w-none ${fitMode === "cover" ? "object-fill" : "object-contain"}`}
                          />
                        )}
                        <div className="light-sweep" />
                        <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-white/5 to-black/20" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Flip Nav Indicator Overlay */}
                {currentPage < totalPages && !isFlipping && (
                  <button
                    onClick={handleNext}
                    className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/45 via-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-end pr-4 text-white cursor-pointer z-30"
                    title="Turn to Next Page"
                  >
                    <span className="w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/20 corner-lift-next">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </span>
                  </button>
                )}

                {/* Left Flip Nav Indicator Overlay */}
                {currentPage > 1 && !isFlipping && (
                  <button
                    onClick={handlePrev}
                    className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/45 via-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-start pl-4 text-white cursor-pointer z-30"
                    title="Turn to Previous Page"
                  >
                    <span className="w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/20">
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </span>
                  </button>
                )}

              </div>
            </div>
          </div>
        )}
      </div>

      {/* THUMBNAILS DRAWER STRIP */}
      {showThumbnails && !loading && pages.length > 0 && (
        <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-1.5 z-20 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
            <span>Page Thumbnails ({totalPages} Pages)</span>
            <span>Click any page to jump</span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
            {pages.map((pgSrc, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={idx}
                  onClick={() => handleJumpToPage(pageNum)}
                  className={`shrink-0 w-16 h-22 rounded-xl overflow-hidden border-2 transition-all relative group cursor-pointer ${
                    isActive
                      ? "border-rose-500 shadow-md shadow-rose-500/30 scale-105"
                      : "border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={pgSrc} alt={`Thumb ${pageNum}`} className="w-full h-full object-cover bg-white" />
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-black/80 text-white px-1 py-0.5 rounded backdrop-blur-sm">
                    {pageNum}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 z-20 shrink-0">
        {/* Page Counter & Jump Input */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Page</span>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-0.5">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) handleJumpToPage(val);
              }}
              className="w-9 bg-transparent text-center font-mono font-bold text-xs text-rose-400 outline-none"
            />
            <span className="text-xs text-slate-500 font-bold">/ {totalPages || 1}</span>
          </div>
        </div>

        {/* Flip Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1 || isFlipping}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentPage <= 1 || isFlipping
                ? "opacity-30 cursor-not-allowed bg-slate-900 text-slate-600 border border-slate-800"
                : "bg-slate-800 hover:bg-slate-700 text-white active:scale-95 border border-slate-700 shadow-md"
            }`}
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            <span>Previous</span>
          </button>

          <span className="text-[10px] font-medium text-slate-500 hidden md:inline">
            Use ← → arrow keys
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages || isFlipping}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentPage >= totalPages || isFlipping
                ? "opacity-30 cursor-not-allowed bg-slate-900 text-slate-600 border border-slate-800"
                : "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white active:scale-95 shadow-lg shadow-rose-500/25 border border-rose-400/30"
            }`}
          >
            <span>Next Page</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
