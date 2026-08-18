"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type BlueprintShot = {
  src: string;
  label: string;
};

/** Warm browser image cache for instant project switches. */
export function preloadBlueprintShots(urls: string[]) {
  if (typeof window === "undefined") return;
  for (const url of urls) {
    if (!url) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={dir === "right" ? "rotate-180" : undefined}
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function wrapDelta(i: number, current: number, n: number) {
  if (n <= 0) return 0;
  let d = i - current;
  const half = n / 2;
  while (d > half) d -= n;
  while (d < -half) d += n;
  return d;
}

function CoverflowStage({
  shots,
  index,
  onSelect,
}: {
  shots: BlueprintShot[];
  index: number;
  onSelect: (i: number) => void;
}) {
  const n = shots.length;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      style={{
        perspective: "1400px",
        perspectiveOrigin: "50% 45%",
        transformStyle: "preserve-3d",
      }}
    >
      {shots.map((shot, i) => {
        const d = wrapDelta(i, index, n);
        const abs = Math.abs(d);
        // Only center + immediate neighbors — no clutter of lookalike side cards
        if (abs > 1.1) return null;

        const x = d * 48;
        const z = abs < 0.01 ? 80 : -abs * 180;
        const rotY = -d * 28;
        const scale = abs < 0.01 ? 1 : 0.72;
        const opacity = abs < 0.01 ? 1 : 0.45;
        const active = abs < 0.5;

        return (
          <button
            key={shot.src}
            type="button"
            aria-label={shot.label}
            onClick={() => {
              if (!active) onSelect(i);
            }}
            className="absolute overflow-hidden border border-white/15 bg-[#080808] shadow-[0_24px_80px_rgba(0,0,0,0.65)] transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            style={{
              width: "min(78%, 720px)",
              aspectRatio: "16 / 10",
              transform: `translateX(${x}%) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
              opacity,
              zIndex: Math.round(20 - abs * 8),
              filter: active ? "none" : "brightness(0.55)",
              cursor: active ? "default" : "pointer",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.label}
              draggable={false}
              className="h-full w-full object-cover object-top"
              loading={abs <= 1 ? "eager" : "lazy"}
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: active
                  ? "linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.35) 100%)"
                  : "rgba(0,0,0,0.28)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

function FullscreenCover({
  shots,
  index,
  onClose,
  onChange,
}: {
  shots: BlueprintShot[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onChange((index - 1 + shots.length) % shots.length);
      if (e.key === "ArrowRight") onChange((index + 1) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onChange, onClose, shots.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[320] flex flex-col bg-[#020202]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6">
        <span className="font-mono text-[10px] tracking-[0.28em] text-white/50">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(shots.length).padStart(2, "0")} · {shots[index]?.label}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="border border-white/20 px-4 py-2 font-mono text-[10px] tracking-[0.22em] text-white/70 hover:border-white/40 hover:text-white"
        >
          CLOSE
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-4 pb-8 sm:px-8">
        {shots.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                onChange((index - 1 + shots.length) % shots.length)
              }
              aria-label="Previous"
              className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-[#020202]/8 text-white backdrop-blur-md hover:border-white/60 sm:left-8"
            >
              <ArrowIcon dir="left" />
            </button>
            <button
              type="button"
              onClick={() => onChange((index + 1) % shots.length)}
              aria-label="Next"
              className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-[#020202]/8 text-white backdrop-blur-md hover:border-white/60 sm:right-8"
            >
              <ArrowIcon dir="right" />
            </button>
          </>
        )}
        <CoverflowStage shots={shots} index={index} onSelect={onChange} />
      </div>
    </motion.div>
  );
}

/**
 * 3D blueprint coverflow — CSS perspective + real images.
 * No WebGL texture chaos; project switches are instant from browser cache.
 */
export function BlueprintViewer({
  shots,
  activeIndex = 0,
  onSelect,
}: {
  shots: BlueprintShot[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
}) {
  const [index, setIndex] = useState(activeIndex);
  const [fullscreen, setFullscreen] = useState(false);
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  useEffect(() => {
    setIndex(Math.min(activeIndex, Math.max(0, shots.length - 1)));
  }, [activeIndex, shots]);

  useEffect(() => {
    preloadBlueprintShots(shots.map((s) => s.src));
  }, [shots]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!shots.length) return;
      const next = (index + dir + shots.length) % shots.length;
      setIndex(next);
      onSelect?.(next);
    },
    [index, onSelect, shots.length]
  );

  const jumpTo = useCallback(
    (i: number) => {
      if (i === index || i < 0 || i >= shots.length) return;
      setIndex(i);
      onSelect?.(i);
    },
    [index, onSelect, shots.length]
  );

  if (!shots.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center border border-white/[0.08] bg-[#080808] font-mono text-[10px] tracking-[0.25em] text-white/30">
        NO VISUAL EVIDENCE
      </div>
    );
  }

  const progress = ((index + 1) / shots.length) * 100;
  const safeIndex = Math.min(index, shots.length - 1);

  return (
    <>
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border border-white/[0.1] bg-[#050505]"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          drag.current = { x: e.clientX, active: true };
        }}
        onPointerMove={(e) => {
          if (!drag.current.active) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 56) {
            go(dx < 0 ? 1 : -1);
            drag.current.x = e.clientX;
            drag.current.active = false;
          }
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        onPointerLeave={() => {
          drag.current.active = false;
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="absolute left-3 top-3 h-5 w-5 border-l border-t border-white/35" />
          <div className="absolute right-3 top-3 h-5 w-5 border-r border-t border-white/35" />
          <div className="absolute bottom-14 left-3 h-5 w-5 border-b border-l border-white/35" />
          <div className="absolute bottom-14 right-3 h-5 w-5 border-b border-r border-white/35" />
          <div className="absolute left-4 top-4 font-mono text-[9px] tracking-[0.28em] text-white/45">
            VISUAL EVIDENCE · BLUEPRINT
          </div>
          <div className="absolute right-4 top-4 max-w-[45%] truncate text-right font-mono text-[9px] tracking-[0.18em] text-white/55">
            {shots[safeIndex]?.label}
          </div>
        </div>

        {shots.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous slide"
              data-cursor="cta"
              className="absolute left-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/35 bg-[#020202]/85 text-white backdrop-blur-md transition-colors hover:border-white/70 hover:bg-white/10 sm:left-4"
            >
              <ArrowIcon dir="left" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next slide"
              data-cursor="cta"
              className="absolute right-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/35 bg-[#020202]/85 text-white backdrop-blur-md transition-colors hover:border-white/70 hover:bg-white/10 sm:right-4"
            >
              <ArrowIcon dir="right" />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label="Open fullscreen"
          data-cursor="cta"
          className="absolute bottom-[3.25rem] right-3 z-40 border border-white/25 bg-[#020202]/85 px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-white/65 backdrop-blur-md hover:border-white/50 hover:text-white"
          onClick={() => setFullscreen(true)}
        >
          EXPAND
        </button>

        <div className="absolute inset-0 z-0 pb-12 pt-2">
          <CoverflowStage
            shots={shots}
            index={safeIndex}
            onSelect={jumpTo}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-[#020202]/92 backdrop-blur-md">
          <div className="h-px w-full bg-white/10">
            <div
              className="h-full bg-white/70 transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-1 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shots.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  jumpTo(i);
                }}
                data-cursor="project"
                className={`relative z-40 shrink-0 border px-2.5 py-1.5 font-mono text-[9px] tracking-[0.16em] transition-colors ${
                  i === safeIndex
                    ? "border-white/40 bg-white/[0.08] text-white"
                    : "border-white/[0.08] text-white/40 hover:text-white/70"
                }`}
              >
                {String(i + 1).padStart(2, "0")} · {shot.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <FullscreenCover
            shots={shots}
            index={safeIndex}
            onClose={() => setFullscreen(false)}
            onChange={(i) => {
              setIndex(i);
              onSelect?.(i);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
