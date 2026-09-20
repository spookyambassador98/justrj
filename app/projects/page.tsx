"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  MagnifyingGlass,
  Play,
  Stop,
  X,
} from "@phosphor-icons/react";
import { useLang, type Lang } from "../components/LanguageProvider";
import { useViewport } from "../hooks/useViewport";
import { PageTransition } from "../components/motion/PageTransition";
import { FOCUS_PROJECT_KEY, requestCurtain } from "@/lib/motion/curtain";
import { isPublicProject } from "../components/production/HudLevelIndex";
import { NdaRequestOverlay } from "../components/NdaRequestOverlay";
import { ProjectsScrollHero } from "../components/motion/ProjectsScrollHero";
import {
  L,
  LList,
  projectsData,
  resolveShot,
  type Localized,
  type Project,
  type Shot,
} from "./data";

const ease = [0.16, 1, 0.3, 1] as const;

type LightboxShot = { src: string; alt: string; caption: string; index: number; total: number };

type GalleryItem = {
  key: string;
  image: Shot | string;
  alt: Localized;
  caption: Localized;
};

function IconArrowLeft({ className = "" }: { className?: string }) {
  return <ArrowLeft className={className} weight="light" aria-hidden />;
}

function IconArrowUpRight({ className = "" }: { className?: string }) {
  return <ArrowUpRight className={className} weight="light" aria-hidden />;
}

function IconX({ className = "" }: { className?: string }) {
  return <X className={className} weight="light" aria-hidden />;
}

function IconPlay({ className = "" }: { className?: string }) {
  return <Play className={className} weight="light" aria-hidden />;
}

function IconStop({ className = "" }: { className?: string }) {
  return <Stop className={className} weight="light" aria-hidden />;
}

function IconMagnify({ className = "" }: { className?: string }) {
  return <MagnifyingGlass className={className} weight="light" aria-hidden />;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({
  children,
  onClick,
  className = "",
  active = false,
  type = "button",
  "aria-pressed": ariaPressed,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  type?: "button" | "submit";
  "aria-pressed"?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { isCoarse } = useViewport();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.35 });

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (isCoarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={ariaPressed}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.22em] transition-[background,box-shadow,color] duration-500 will-change-transform sm:px-6 sm:text-[11px] sm:tracking-[0.26em] ${
        active
          ? "bg-violet-400/15 text-violet-100 shadow-[0_0_40px_rgba(167,139,250,0.18)]"
          : "bg-white/[0.03] text-white/75 hover:bg-white/[0.06] hover:text-white"
      } ${className}`}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: active
            ? "inset 0 0 0 1px rgba(196,181,253,0.35)"
            : "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

function ImageLightbox({
  shot,
  onClose,
  onPrev,
  onNext,
  onIndex,
  closeLabel,
  prevLabel,
  nextLabel,
  items,
  lang,
  index,
}: {
  shot: LightboxShot | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onIndex: (i: number) => void;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  items: GalleryItem[];
  lang: Lang;
  index: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  useEffect(() => {
    if (!shot) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [shot, onClose, onPrev, onNext]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !shot) return;
    const slides = track.querySelectorAll<HTMLElement>("[data-lb-slide]");
    const el = slides[index];
    if (!el) return;
    syncing.current = true;
    const left = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    const t = window.setTimeout(() => {
      syncing.current = false;
    }, 400);
    return () => clearTimeout(t);
  }, [index, shot]);

  return (
    <AnimatePresence>
      {shot && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease }}
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
        >
          <div className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6">
            <span className="rounded-full bg-black/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/55 backdrop-blur-md">
              {String(shot.index + 1).padStart(2, "0")} / {String(shot.total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white/80 backdrop-blur-md transition-colors hover:bg-black/75 hover:text-white"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center">
            {shot.total > 1 && (
              <>
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label={prevLabel}
                  className="absolute left-2 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white/75 backdrop-blur-md transition-colors hover:text-white sm:left-5"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
                >
                  <IconArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label={nextLabel}
                  className="absolute right-2 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white/75 backdrop-blur-md transition-colors hover:text-white sm:right-5"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
                >
                  <span className="rotate-180">
                    <IconArrowLeft className="h-4 w-4" />
                  </span>
                </button>
              </>
            )}

            <div
              ref={trackRef}
              className="flex h-full w-full snap-x snap-mandatory gap-5 overflow-x-auto px-[6vw] pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={(e) => {
                if (syncing.current) return;
                const scroller = e.currentTarget;
                const slides = scroller.querySelectorAll<HTMLElement>("[data-lb-slide]");
                let best = index;
                let bestDist = Infinity;
                slides.forEach((slide, i) => {
                  const center =
                    slide.offsetLeft + slide.clientWidth / 2 - scroller.scrollLeft;
                  const dist = Math.abs(center - scroller.clientWidth / 2);
                  if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                  }
                });
                if (best !== index) onIndex(best);
              }}
            >
              {items.map((item) => (
                <div
                  key={item.key}
                  data-lb-slide
                  className="flex w-[min(90vw,1100px)] shrink-0 snap-center flex-col justify-center"
                >
                  <div
                    className="overflow-hidden rounded-2xl bg-[#0a0a0a]"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
                  >
                    <img
                      src={resolveShot(item.image, lang)}
                      alt={L(item.alt, lang)}
                      className="max-h-[min(78dvh,860px)] w-full bg-black object-contain"
                      draggable={false}
                    />
                  </div>
                  <p className="mt-3 px-1 text-center text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {L(item.caption, lang) || L(item.alt, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectGallery({
  items,
  lang,
  onOpen,
  hint,
}: {
  items: GalleryItem[];
  lang: Lang;
  onOpen: (index: number) => void;
  hint: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByDir = (dir: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slide = scroller.querySelector<HTMLElement>("[data-gallery-slide]");
    const amount = slide
      ? slide.offsetWidth + 16
      : Math.max(280, scroller.clientWidth * 0.75);
    scroller.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">{hint}</p>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 text-white/25 sm:flex">
            <IconMagnify className="h-3.5 w-3.5" />
            <span className="text-[9px] uppercase tracking-[0.2em]">zoom</span>
          </div>
          {items.length > 1 && (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => scrollByDir(-1)}
                aria-label="Previous"
                className="inline-flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-white/35 hover:text-white"
              >
                <IconArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByDir(1)}
                aria-label="Next"
                className="inline-flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-white/35 hover:text-white"
              >
                <span className="rotate-180">
                  <IconArrowLeft className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Gallery"
      >
        {items.map((item, i) => {
          const src = resolveShot(item.image, lang);
          return (
            <motion.button
              key={item.key}
              type="button"
              role="listitem"
              data-gallery-slide
              onClick={() => onOpen(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.7, ease, delay: Math.min(i * 0.04, 0.28) }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              className="group relative w-[min(82vw,28rem)] shrink-0 snap-center overflow-hidden rounded-2xl bg-white/[0.02] text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-300/40 sm:w-[min(70vw,32rem)]"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
              aria-label={`${L(item.alt, lang)} — enlarge`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={src}
                  alt={L(item.alt, lang)}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] will-change-transform"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-white/60 backdrop-blur-md">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/70 opacity-0 backdrop-blur-md transition-opacity duration-400 group-hover:opacity-100">
                  <IconMagnify className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="space-y-1 px-4 py-3">
                <p className="truncate text-[12px] text-white/70">{L(item.alt, lang)}</p>
                <p className="truncate text-[10px] uppercase tracking-[0.18em] text-white/30">
                  {L(item.caption, lang)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function DemoStage({
  project,
  open,
  onClose,
  lang,
  labels,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
  lang: Lang;
  labels: { live: string; close: string; loading: string; external: string };
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) setLoaded(false);
  }, [open, project.id]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: 12 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: 8 }}
          transition={{ duration: 0.55, ease }}
          className="overflow-hidden"
        >
          <div
            className="relative overflow-hidden rounded-[1.35rem] bg-black/40 backdrop-blur-xl"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/50" />
                  <span className="relative h-2 w-2 rounded-full bg-violet-400" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.26em] text-violet-200/80">
                  {labels.live}
                </span>
                <span className="hidden font-mono text-[10px] text-white/25 sm:inline">
                  {L(project.title, lang)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
                >
                  {labels.external}
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
                >
                  <IconStop className="h-3.5 w-3.5" />
                  {labels.close}
                </button>
              </div>
            </div>

            <div className="relative aspect-[16/10] w-full bg-[#070707] sm:aspect-[16/9]">
              {!loaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#070707]">
                  <div className="h-px w-40 overflow-hidden bg-white/5">
                    <motion.div
                      className="h-full bg-violet-400/80"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.4, ease, repeat: Infinity }}
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                    {labels.loading}
                  </p>
                </div>
              )}
              <iframe
                key={project.id}
                src={project.link}
                title={`${L(project.title, lang)} demo`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectCase({
  project,
  lang,
  ui,
  demoOpen,
  onToggleDemo,
  onOpenGallery,
}: {
  project: Project;
  lang: Lang;
  ui: ReturnType<typeof getUi>;
  demoOpen: boolean;
  onToggleDemo: () => void;
  onOpenGallery: (items: GalleryItem[], index: number) => void;
}) {
  const gallery = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = [];
    const seen = new Set<string>();

    const push = (item: GalleryItem) => {
      const src = resolveShot(item.image, lang);
      if (!src || seen.has(src)) return;
      seen.add(src);
      items.push(item);
    };

    push({
      key: `${project.id}-hero`,
      image: project.image,
      alt: project.imageCaption,
      caption: project.imageCaption,
    });

    for (const f of project.features) {
      if (!f.image) continue;
      push({
        key: `${project.id}-${f.id}`,
        image: f.image,
        alt: f.title,
        caption: f.caption ?? f.title,
      });
    }
    return items;
  }, [project, lang]);

  return (
    <section
      id={project.id}
      data-project-id={project.id}
      className="scroll-mt-28 space-y-10 border-b border-white/[0.05] py-16 last:border-b-0 sm:space-y-12 sm:py-24"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/35 sm:text-[11px]">
            <span className="font-mono text-violet-300/70">{project.index}</span>
            <span className="h-px w-8 shrink-0 bg-white/15" aria-hidden />
            <span>{project.year}</span>
          </div>

          <h2 className="relative">
            <Reveal>
              <span
                className="block whitespace-nowrap font-serif text-[clamp(2.1rem,5.2vw,3.85rem)] italic leading-[1.05] tracking-[-0.03em] text-white"
                style={{
                  textShadow: "0 0 60px rgba(196,181,253,0.12)",
                }}
              >
                {L(project.title, lang)}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <span className="mt-3 block text-[13px] font-light uppercase leading-snug tracking-[0.22em] text-white/40 sm:text-[14px] sm:tracking-[0.26em]">
                {L(project.accent, lang)}
              </span>
            </Reveal>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.12, duration: 0.7, ease }}
            className="max-w-[42ch] text-[14px] leading-[1.85] text-white/55 sm:text-[15px]"
          >
            {L(project.hook, lang)}
          </motion.p>

          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                ["problem", project.problem, ui.problem],
                ["build", project.build, ui.build],
                ["result", project.result, ui.result],
              ] as const
            ).map(([key, copy, label], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.55, ease }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm"
              >
                <p className="mb-2 text-[9px] uppercase tracking-[0.28em] text-violet-300/50">
                  {label}
                </p>
                <p className="text-[12px] font-light leading-relaxed text-white/55 sm:text-[13px]">
                  {L(copy, lang)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">{ui.stack}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.03, duration: 0.45, ease }}
                  className="rounded-full bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/70"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <MagneticButton active={demoOpen} aria-pressed={demoOpen} onClick={onToggleDemo}>
              {demoOpen ? <IconStop className="h-3.5 w-3.5" /> : <IconPlay className="h-3.5 w-3.5" />}
              {demoOpen ? ui.demoOff : ui.demoOn}
            </MagneticButton>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-violet-200"
            >
              {ui.openTab}
              <IconArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="border-t border-white/[0.06] pt-5 text-[11px] uppercase tracking-[0.2em] text-white/30">
            <div className="flex items-start justify-between gap-6">
              <span>{ui.role}</span>
              <span className="max-w-[22ch] text-right normal-case tracking-normal text-white/60">
                {L(project.role, lang)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-7">
          <div className="space-y-5">
            {LList(project.overview, lang).map((text) => (
              <motion.p
                key={text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.75, ease }}
                className="max-w-[52ch] text-[15px] leading-[1.85] text-white/55 sm:text-[16px]"
              >
                {text}
              </motion.p>
            ))}
          </div>

          <DemoStage
            project={project}
            open={demoOpen}
            onClose={onToggleDemo}
            lang={lang}
            labels={{
              live: ui.live,
              close: ui.demoOff,
              loading: ui.demoLoading,
              external: ui.openTab,
            }}
          />
        </div>
      </div>

      <ProjectGallery
        items={gallery}
        lang={lang}
        hint={ui.gallery}
        onOpen={(index) => onOpenGallery(gallery, index)}
      />

      <details className="group rounded-2xl bg-white/[0.015] open:bg-white/[0.025]" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
        <summary className="cursor-pointer list-none px-5 py-4 text-[11px] uppercase tracking-[0.24em] text-white/45 transition-colors hover:text-white/70 sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-4">
            <span>{ui.modules}</span>
            <span className="font-mono text-[10px] text-white/25 transition-transform duration-400 group-open:rotate-45">
              +
            </span>
          </span>
        </summary>
        <div className="space-y-8 border-t border-white/[0.05] px-5 py-6 sm:px-6 sm:py-8">
          <p className="max-w-[48ch] text-[13px] leading-relaxed text-white/35">{ui.modulesHint}</p>
          <div className="grid gap-8 md:grid-cols-2">
            {project.features.map((feature, idx) => (
              <article key={feature.id} className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-violet-300/45">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-xl italic text-white/90">{L(feature.title, lang)}</h3>
                </div>
                <p className="pl-9 text-[14px] leading-[1.75] text-white/50">{L(feature.body, lang)}</p>
              </article>
            ))}
          </div>
          <div className="rounded-xl bg-black/35 p-5 sm:p-6" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/30">{ui.architecture}</p>
            <p className="font-mono text-sm leading-relaxed text-violet-100/50">{L(project.architecture, lang)}</p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-black/50 p-4 font-mono text-[12px] leading-7 text-white/60">
              <code>{project.code}</code>
            </pre>
          </div>
        </div>
      </details>
    </section>
  );
}

function getUi(lang: Lang) {
  if (lang === "ru") {
    return {
      back: "Назад",
      returning: "Возврат",
      pageEyebrow: "Case studies",
      pageTitle: "Проекты",
      pageSub:
        "Публичные системы с живым демо. Остальное разбираем на интервью — без имён и экранов.",
      role: "Роль",
      stack: "Стек",
      problem: "Problem",
      build: "Build",
      result: "Result",
      demoOn: "Включить демо",
      demoOff: "Выключить демо",
      demoLoading: "Загрузка демо",
      live: "Live demo",
      openTab: "В новой вкладке",
      gallery: "Галерея — листайте · нажмите, чтобы увеличить",
      modules: "Экраны и модули",
      modulesHint: "Разделы продукта так, как их видит пользователь. Скриншоты с живых сборок.",
      architecture: "Как это работает",
      close: "Закрыть",
      prev: "Предыдущий кадр",
      next: "Следующий кадр",
      indexLabel: "Каталог",
    };
  }
  if (lang === "uk") {
    return {
      back: "Назад",
      returning: "Повернення",
      pageEyebrow: "Case studies",
      pageTitle: "Проєкти",
      pageSub:
        "Публічні системи з живим демо. Решту розбираємо на інтерв’ю — без імен і екранів.",
      role: "Роль",
      stack: "Стек",
      problem: "Problem",
      build: "Build",
      result: "Result",
      demoOn: "Увімкнути демо",
      demoOff: "Вимкнути демо",
      demoLoading: "Завантаження демо",
      live: "Live demo",
      openTab: "У новій вкладці",
      gallery: "Галерея — гортайте · натисніть, щоб збільшити",
      modules: "Екрани й модулі",
      modulesHint: "Розділи продукту так, як їх бачить користувач. Скріншоти з живих збірок.",
      architecture: "Як це працює",
      close: "Закрити",
      prev: "Попередній кадр",
      next: "Наступний кадр",
      indexLabel: "Каталог",
    };
  }
  return {
    back: "Back",
    returning: "Returning",
    pageEyebrow: "Case studies",
    pageTitle: "Projects",
    pageSub:
      "Public systems with live demos. Everything else is walked in the interview — no names, no screens.",
    role: "Role",
    stack: "Stack",
    problem: "Problem",
    build: "Build",
    result: "Result",
    demoOn: "Launch demo",
    demoOff: "Stop demo",
    demoLoading: "Loading demo",
    live: "Live demo",
    openTab: "Open in tab",
    gallery: "Gallery — scroll · tap to enlarge",
    modules: "Screens & modules",
    modulesHint: "Product sections as a real user sees them. Screenshots from live builds.",
    architecture: "How it works",
    close: "Close",
    prev: "Previous frame",
    next: "Next frame",
    indexLabel: "Catalog",
  };
}

export default function ProjectsPage() {
  const { lang } = useLang();
  const ui = getUi(lang);
  const catalog = useMemo(
    () => projectsData.filter((p) => isPublicProject(p.id)),
    []
  );
  const [routing, setRouting] = useState(false);
  const [activeId, setActiveId] = useState(catalog[0]?.id ?? "");
  const [demoId, setDemoId] = useState<string | null>(null);
  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [ndaHold, setNdaHold] = useState(false);

  const glow = catalog.find((p) => p.id === activeId)?.glow ?? catalog[0]?.glow;
  const landingLock = useRef<string | null>(null);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace(/^#/, "");
    const query = params.get("p") || "";
    let stored = "";
    try {
      stored = sessionStorage.getItem(FOCUS_PROJECT_KEY) || "";
      if (stored) sessionStorage.removeItem(FOCUS_PROJECT_KEY);
    } catch {
      /* private mode */
    }

    const candidates = [query, hash, stored].filter(Boolean);
    if (params.get("hold") === "nda" || candidates.some((id) => !isPublicProject(id))) {
      setNdaHold(true);
      history.replaceState(null, "", "/projects");
      return;
    }

    const target = candidates.find((id) => catalog.some((p) => p.id === id));
    if (!target) return;

    landingLock.current = target;
    setActiveId(target);

    const jump = () => {
      const el = document.getElementById(target);
      if (!el) return false;
      el.scrollIntoView({ behavior: "auto", block: "start" });
      history.replaceState(null, "", `/projects#${target}`);
      return true;
    };

    jump();
    const raf = requestAnimationFrame(() => jump());
    const t1 = window.setTimeout(jump, 120);
    const t2 = window.setTimeout(jump, 400);
    const unlock = window.setTimeout(() => {
      landingLock.current = null;
    }, 900);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(unlock);
    };
  }, [catalog]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-project-id]"));
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (landingLock.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target) {
          const id = (visible.target as HTMLElement).dataset.projectId;
          if (id) {
            setActiveId(id);
            history.replaceState(null, "", `#${id}`);
          }
        }
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: [0.15, 0.35, 0.55] }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const goHome = () => {
    requestCurtain("/");
  };

  const scrollToProject = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const openGallery = useCallback((items: GalleryItem[], index: number) => {
    setLightboxItems(items);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const lightboxShot: LightboxShot | null =
    lightboxOpen && lightboxItems[lightboxIndex]
      ? {
          src: resolveShot(lightboxItems[lightboxIndex].image, lang),
          alt: L(lightboxItems[lightboxIndex].alt, lang),
          caption: L(lightboxItems[lightboxIndex].caption, lang),
          index: lightboxIndex,
          total: lightboxItems.length,
        }
      : null;

  return (
    <PageTransition>
    <div className="relative min-h-screen bg-transparent text-white">
      <div className="pointer-events-none fixed inset-0 z-0" />
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        animate={{ background: glow }}
        transition={{ duration: 1.4, ease }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(167,139,250,0.06), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 20%, rgba(99,102,241,0.05), transparent 50%)",
        }}
      />

      <ImageLightbox
        shot={lightboxShot}
        onClose={closeLightbox}
        onPrev={() =>
          setLightboxIndex((i) => (i - 1 + lightboxItems.length) % lightboxItems.length)
        }
        onNext={() => setLightboxIndex((i) => (i + 1) % lightboxItems.length)}
        onIndex={setLightboxIndex}
        closeLabel={ui.close}
        prevLabel={ui.prev}
        nextLabel={ui.next}
        items={lightboxItems}
        lang={lang}
        index={lightboxIndex}
      />

      <AnimatePresence>
        {routing && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-72 space-y-4">
              <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
                <span>{ui.returning}</span>
                <span className="font-mono text-violet-400/70">[ SYNC ]</span>
              </div>
              <div className="relative h-px overflow-hidden bg-white/5">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-violet-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.75, ease }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
          className="fixed inset-x-0 top-0 z-50 h-14 bg-[var(--bg)]/70 backdrop-blur-md safe-pad-t sm:h-16"
          style={{ boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.08)" }}
        >
        <div className="mx-auto flex h-full w-full max-w-[100rem] items-center justify-between px-4 sm:px-6 lg:px-12">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:gap-2.5 sm:text-[11px]"
          >
            <IconArrowLeft className="h-3.5 w-3.5 shrink-0 text-white/70" />
            <span className="border-b border-white/20 pb-0.5">{ui.back}</span>
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
            EN
          </span>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-[100rem] grid-cols-1 gap-0 px-4 pb-24 pt-24 safe-pad-x sm:px-6 sm:pt-28 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 lg:px-12 xl:grid-cols-[15rem_minmax(0,1fr)]">
        {/* Scalable index — scrollable, not a bottom dock */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-4 hidden lg:block">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">{ui.indexLabel}</p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-white/20">
              {String(catalog.length).padStart(2, "0")}
            </p>
          </div>

          <nav
            aria-label={ui.indexLabel}
            className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mb-0 lg:max-h-[calc(100dvh-10rem)] lg:flex-col lg:gap-1 lg:overflow-y-auto lg:overflow-x-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {catalog.map((p) => {
              const active = p.id === activeId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToProject(p.id)}
                  className={`relative shrink-0 rounded-full px-4 py-2.5 text-left transition-colors lg:w-full lg:rounded-xl lg:px-3 lg:py-3 ${
                    active ? "text-white" : "text-white/35 hover:text-white/70"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-index-active"
                      className="absolute inset-0 rounded-full bg-white/[0.05] lg:rounded-xl"
                      style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-violet-300/50">
                      {p.index}
                    </span>
                    <span className="max-w-[12rem] truncate text-[11px] tracking-[0.04em] lg:max-w-none">
                      {L(p.nav, lang)}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main>
          <ProjectsScrollHero
            eyebrow={ui.pageEyebrow}
            title={ui.pageTitle}
            sub={ui.pageSub}
          />

          {catalog.map((project) => (
            <ProjectCase
              key={project.id}
              project={project}
              lang={lang}
              ui={ui}
              demoOpen={demoId === project.id}
              onToggleDemo={() =>
                setDemoId((cur) => (cur === project.id ? null : project.id))
              }
              onOpenGallery={openGallery}
            />
          ))}
        </main>
      </div>
      <NdaRequestOverlay
        open={ndaHold}
        onClose={() => setNdaHold(false)}
        lang={lang}
      />
    </div>
    </PageTransition>
  );
}
