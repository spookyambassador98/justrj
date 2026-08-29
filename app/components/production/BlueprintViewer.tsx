"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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

function Lightbox({
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
  const shot = shots[index];

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

  if (!shot) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[320] flex items-center justify-center p-3 sm:p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={shot.label}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/88 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 flex max-h-[min(92dvh,920px)] w-full max-w-6xl flex-col"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={shot.src}
            src={shot.src}
            alt={shot.label}
            className="max-h-[min(82dvh,860px)] w-full bg-black object-contain object-top"
            draggable={false}
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
            <span className="rounded-full bg-black/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/55 backdrop-blur-md">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(shots.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white/80 backdrop-blur-md hover:bg-black/75 hover:text-white"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {shots.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  onChange((index - 1 + shots.length) % shots.length)
                }
                aria-label="Previous"
                className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-md hover:text-white sm:left-4"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
              >
                <ArrowIcon dir="left" />
              </button>
              <button
                type="button"
                onClick={() => onChange((index + 1) % shots.length)}
                aria-label="Next"
                className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-md hover:text-white sm:right-4"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
              >
                <ArrowIcon dir="right" />
              </button>
            </>
          )}
        </div>
        <p className="mt-3 px-1 text-center text-[10px] uppercase tracking-[0.22em] text-white/45">
          {shot.label}
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Flat screenshot stage — click any frame to enlarge, APEX-style.
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
      if (i < 0 || i >= shots.length) return;
      setIndex(i);
      onSelect?.(i);
    },
    [onSelect, shots.length]
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
  const current = shots[safeIndex];

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
        <button
          type="button"
          aria-label={`${current.label} — enlarge`}
          data-cursor="cta"
          className="absolute inset-0 z-0 pb-12"
          onClick={() => setFullscreen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.label}
            draggable={false}
            className="h-full w-full object-cover object-top"
          />
        </button>

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

        <div className="pointer-events-none absolute right-4 top-4 z-30 max-w-[45%] truncate text-right font-mono text-[9px] tracking-[0.18em] text-white/55">
          {current.label}
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
          <Lightbox
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
