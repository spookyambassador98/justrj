"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Lock } from "@phosphor-icons/react";
import type { Lang } from "@/app/components/LanguageProvider";
import { MagneticButton } from "@/app/components/ui/MagneticButton";
import {
  L,
  LList,
  resolveShot,
  projectsData,
  type Project,
} from "@/app/projects/data";
import {
  fadeRise,
  hudPulse,
  staggerContainer,
} from "@/lib/motion";
import type { BlueprintShot } from "./BlueprintViewer";
import { FEATURED_IDS } from "./featured";

const BlueprintViewer = dynamic(
  () => import("./BlueprintViewer").then((m) => m.BlueprintViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[16/10] items-center justify-center border border-white/[0.08] bg-[#080808] font-mono text-[10px] tracking-[0.25em] text-white/30">
        LOADING EVIDENCE…
      </div>
    ),
  }
);

function evidenceFromProject(project: Project, lang: Lang): BlueprintShot[] {
  const shots: BlueprintShot[] = [];
  const seen = new Set<string>();

  const push = (src: string, label: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    shots.push({ src, label });
  };

  push(
    resolveShot(project.image, lang),
    L(project.imageCaption, lang) || L(project.title, lang)
  );

  for (const feature of project.features) {
    if (!feature.image) continue;
    push(
      resolveShot(feature.image, lang),
      L(feature.caption, lang) || L(feature.title, lang)
    );
  }

  // Cap at 6 distinct surfaces — enough evidence without drowning the HUD
  return shots.slice(0, 6);
}

function ArchitectureDiagram({ tech }: { tech: string[] }) {
  const layers = tech.slice(0, 4);
  return (
    <div className="relative h-full border border-white/[0.08] bg-[#080808] p-4">
      <p className="mb-4 font-mono text-[9px] tracking-[0.28em] text-white/35">
        STACK TOPOLOGY
      </p>
      <div className="flex flex-col gap-2">
        {layers.map((layer, i) => (
          <motion.div
            key={layer}
            initial={{ opacity: 0, scaleX: 0.85 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: i * 0.08,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative origin-left border border-white/[0.1] bg-white/[0.02] px-3 py-2.5"
            style={{
              marginLeft: `${i * 10}px`,
              marginRight: `${(layers.length - 1 - i) * 6}px`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/70">
                L{i + 1} · {layer.toUpperCase()}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              <span className="font-mono text-[9px] text-white/30">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function authenticFacts(project: Project, _lang: Lang) {
  return [
    {
      label: "YEAR",
      value: project.year,
    },
    {
      label: "SURFACES",
      value: String(project.features.length),
    },
    {
      label: "STACK",
      value: String(project.tech.length),
      unit: "layers",
    },
    {
      label: "DEMO",
      value: project.link ? "LIVE" : "—",
    },
  ];
}

/**
 * Shown until the visitor picks a system. Deliberately generic: NDA work must
 * never leak (no names, no captions, no numbers). A redacted archive with a
 * cursor-driven "decoder" that only ever reveals random glyphs.
 */
const GLYPHS = "01ABCDEF23456789#%$&@<>/\\[]{}=+*";
const ROWS = 11;
const COLS = 46;

function randomLine() {
  let out = "";
  for (let i = 0; i < COLS; i++) {
    out += Math.random() < 0.14 ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

function HudPlaceholder() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>(() =>
    Array.from({ length: ROWS }, () => "")
  );
  const [pointer, setPointer] = useState(false);

  // scramble stream
  useEffect(() => {
    setLines(Array.from({ length: ROWS }, randomLine));
    const id = setInterval(() => {
      setLines((prev) =>
        prev.map((l) => (Math.random() < 0.35 ? randomLine() : l))
      );
    }, 110);
    return () => clearInterval(id);
  }, []);

  // idle spotlight path (touch / no pointer), pointer overrides
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      if (!pointer) {
        const t = (now - t0) / 1000;
        el.style.setProperty("--mx", `${50 + Math.sin(t * 0.7) * 32}%`);
        el.style.setProperty("--my", `${50 + Math.sin(t * 1.1 + 1) * 26}%`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    if (!pointer) setPointer(true);
  };

  const mask =
    "radial-gradient(circle 130px at var(--mx, 50%) var(--my, 50%), black 0%, rgba(0,0,0,0.55) 45%, transparent 100%)";

  return (
    <motion.div
      key="placeholder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="hud-frame relative overflow-hidden"
    >
      <div
        ref={boxRef}
        onPointerMove={onMove}
        onPointerLeave={() => setPointer(false)}
        className="relative aspect-[16/10] min-h-[320px] w-full select-none"
        style={{ touchAction: "pan-y" }}
      >
        {/* redacted bars (always visible, static, generic) */}
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col justify-center gap-[9px] px-[7%]"
        >
          {Array.from({ length: ROWS }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="h-[14px] origin-left bg-white/[0.07]"
              style={{ width: `${48 + ((i * 37) % 47)}%` }}
            />
          ))}
        </div>

        {/* decoder layer: only random glyphs, revealed under the cursor */}
        <pre
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-[9px] overflow-hidden px-[7%] font-mono text-[11px] leading-[14px] tracking-[0.18em] text-violet-300/80"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          {lines.map((l, i) => (
            <span key={i} className="block whitespace-pre">
              {l}
            </span>
          ))}
        </pre>

        {/* scan line */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent"
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* centre seal */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center rounded-sm bg-[#060606]/85 px-8 py-6 text-center backdrop-blur-sm">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
              <motion.svg
                viewBox="0 0 64 64"
                className="absolute inset-0 h-full w-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              >
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeDasharray="3 5"
                />
              </motion.svg>
              <motion.svg
                viewBox="0 0 64 64"
                className="absolute inset-0 h-full w-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 11, ease: "linear", repeat: Infinity }}
              >
                <circle
                  cx="32"
                  cy="32"
                  r="24"
                  fill="none"
                  stroke="rgba(196,181,253,0.5)"
                  strokeDasharray="14 10"
                />
              </motion.svg>
              <Lock size={20} weight="light" className="text-white/80" />
            </div>
            <p className="font-mono text-[9px] tracking-[0.34em] text-white/40">
              REDACTED ARCHIVE
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.24em] text-white/75">
              SELECT A SYSTEM TO BEGIN
            </p>
          </div>
        </div>
      </div>
      <p className="border-t border-white/[0.06] px-4 py-3 font-mono text-[9px] tracking-[0.2em] text-white/30">
        Open a system on the left — evidence loads only for the one you choose.
      </p>
    </motion.div>
  );
}

const copy = {
  en: {
    kicker: "03 / PRODUCTION HUD · VISUAL EVIDENCE",
    title: "Inspect a system",
    index: "LINE",
    problem: "PROBLEM",
    build: "BUILD",
    result: "RESULT",
    architecture: "ARCHITECTURE",
    open: "Open case",
    demo: "Live demo",
    evidence: "Interactive blueprints — hover to inspect",
  },
} as const;

/**
 * Production HUD — brutalist engineering desk with R3F screenshot blueprints.
 * Facts only from verified project fields. Screenshots from shipped captures.
 */
export function ProductionHUD({
  lang,
  onNavigate,
}: {
  lang: Lang;
  onNavigate: (projectId?: string) => void;
}) {
  const t = copy.en;
  const featured = useMemo(
    () =>
      FEATURED_IDS.map((id) => projectsData.find((p) => p.id === id)).filter(
        Boolean
      ) as Project[],
    []
  );
  const [active, setActive] = useState<number | null>(null);
  const [shotIndex, setShotIndex] = useState(0);
  // null = nothing chosen yet → placeholder instead of a screenshot
  const project = active === null ? null : (featured[active] ?? null);
  const facts = project ? authenticFacts(project, lang) : [];
  const overview = project ? LList(project.overview, lang) : [];
  const shots = useMemo(
    () => (project ? evidenceFromProject(project, lang) : []),
    [project, lang]
  );

  // Preload every featured project's evidence so switching is instant
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("./BlueprintViewer");
      if (cancelled) return;
      const urls = featured.flatMap((p) =>
        evidenceFromProject(p, "en").map((s) => s.src)
      );
      mod.preloadBlueprintShots(urls);
    })();
    return () => {
      cancelled = true;
    };
  }, [featured]);

  const selectProject = (i: number) => {
    setActive(i);
    setShotIndex(0);
  };

  return (
    <section
      id="production"
      className="pointer-events-auto relative isolate z-10 mt-24 w-full md:mt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-2 -inset-y-6 -z-10 bg-[var(--bg)]/80 backdrop-blur-[2px] sm:-inset-x-4"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeRise}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.36em] text-white/40">
              {t.kicker}
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-[-0.02em] text-white md:text-5xl">
              {t.title}
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[9px] leading-relaxed tracking-[0.16em] text-white/30">
            ORBITAL · ASEMA · EYE · FOAMCORE · HIRE · LEAD · DRIFT — real captures · real
            stack · no invented metrics
          </p>
        </motion.div>

        <motion.div variants={fadeRise} className="mb-6 flex flex-wrap gap-2">
          {featured.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectProject(i)}
              data-cursor="cta"
              className={`border px-4 py-2 font-mono text-[10px] tracking-[0.22em] transition-colors ${
                i === active
                  ? "border-[color:var(--filament)]/50 bg-white/[0.04] text-white"
                  : "border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {L(p.title, lang).toUpperCase()}
            </button>
          ))}
        </motion.div>

        <motion.div
          variants={hudPulse}
          className="hud-frame relative overflow-hidden"
        >
          <div className="relative z-20 grid lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-white/[0.08] p-5 lg:border-b-0 lg:border-r lg:border-white/[0.08]">
              <div className="mb-5 flex items-center justify-between font-mono text-[9px] tracking-[0.25em] text-white/35">
                <span>{t.index}</span>
                <span>
                  {active === null ? "--" : String(active + 1).padStart(2, "0")} /{" "}
                  {String(featured.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="space-y-1">
                {featured.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => selectProject(i)}
                      data-cursor="project"
                      className={`flex w-full items-center justify-between gap-2 px-3 py-3 text-left font-mono text-[11px] tracking-[0.12em] transition-colors ${
                        i === active
                          ? "bg-white/[0.05] text-white"
                          : "text-white/45 hover:bg-white/[0.02] hover:text-white/75"
                      }`}
                    >
                      <span className="truncate">{L(p.title, lang)}</span>
                      <span className="text-white/25">{p.year}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-[9px] leading-relaxed tracking-[0.14em] text-white/25">
                {t.evidence}
              </p>
            </aside>

            <div className="p-4 md:p-7">
              {!project ? (
                <HudPlaceholder />
              ) : (
              <>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`${project.id}-head`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5 flex flex-wrap items-start justify-between gap-4"
                >
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.28em] text-white/35">
                      {L(project.accent, lang).toUpperCase()} ·{" "}
                      {L(project.role, lang)}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-[-0.02em] text-white md:text-4xl">
                      {L(project.title, lang)}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-white/50">
                      {L(project.hook, lang)}
                    </p>
                  </div>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="cta"
                      className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
                    >
                      {t.demo}
                      <ArrowUpRight size={14} weight="light" />
                    </a>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {/* Key by project — never mix Art of Look into Lead Desk, etc. */}
              <div className="mb-6">
                <BlueprintViewer
                  key={project.id}
                  shots={shots}
                  activeIndex={shotIndex}
                  onSelect={setShotIndex}
                />
              </div>

              <AnimatePresence mode="popLayout">
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
                    {facts.map((f) => (
                      <div
                        key={f.label}
                        className="border border-white/[0.08] bg-[#0a0a0a] px-3 py-3"
                      >
                        <div className="font-mono text-[9px] tracking-[0.22em] text-white/35">
                          {f.label}
                        </div>
                        <div className="mt-1.5 font-display text-xl text-white tabular-nums">
                          {f.value}
                          {"unit" in f && f.unit ? (
                            <span className="ml-1 font-mono text-[10px] tracking-wider text-white/35">
                              {f.unit}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    {(
                      [
                        [t.problem, project.problem],
                        [t.build, project.build],
                        [t.result, project.result],
                      ] as const
                    ).map(([label, loc]) => (
                      <div
                        key={label}
                        className="border border-white/[0.08] bg-white/[0.015] p-4"
                      >
                        <p className="font-mono text-[9px] tracking-[0.25em] text-white/35">
                          {label}
                        </p>
                        <p className="mt-2 text-sm font-light leading-relaxed text-white/60">
                          {L(loc, lang)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <ArchitectureDiagram tech={project.tech} />
                    <div className="border border-white/[0.08] bg-[#080808] p-4">
                      <p className="mb-3 font-mono text-[9px] tracking-[0.28em] text-white/35">
                        {t.architecture}
                      </p>
                      <p className="text-sm font-light leading-relaxed text-white/55">
                        {L(project.architecture, lang)}
                      </p>
                      {overview[0] ? (
                        <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs font-light leading-relaxed text-white/40">
                          {overview[0]}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="border border-white/[0.08] px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-white/45"
                      >
                        {tech}
                      </span>
                    ))}
                    <MagneticButton
                      onClick={() => onNavigate(project.id)}
                      className="!ml-auto !max-w-none !rounded-none !px-5 !py-2.5 !text-[10px] !tracking-[0.2em]"
                    >
                      {t.open} →
                    </MagneticButton>
                  </div>
                </motion.div>
              </AnimatePresence>
              </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
