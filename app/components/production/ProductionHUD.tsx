"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
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

const FEATURED_IDS = [
  "orbital",
  "asema",
  "eye_master",
  "foamcore",
  "hire_desk",
  "lead_desk",
] as const;

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

const copy = {
  en: {
    kicker: "ENGINEERING SHOWCASE · PRODUCTION HUD & VISUAL EVIDENCE",
    title: "Production systems",
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
  onNavigate: () => void;
}) {
  const t = copy.en;
  const featured = useMemo(
    () =>
      FEATURED_IDS.map((id) => projectsData.find((p) => p.id === id)).filter(
        Boolean
      ) as Project[],
    []
  );
  const [active, setActive] = useState(0);
  const [shotIndex, setShotIndex] = useState(0);
  const project = featured[active] ?? featured[0];
  const facts = authenticFacts(project, lang);
  const overview = LList(project.overview, lang);
  const shots = useMemo(
    () => evidenceFromProject(project, lang),
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
      {/* Kill neuron bleed-through behind the desk */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 -inset-y-8 -z-10 bg-[#020202]/92 sm:-inset-x-8"
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
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-white md:text-5xl">
              {t.title}
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[9px] leading-relaxed tracking-[0.16em] text-white/30">
            ORBITAL · ASEMA · EYE · FOAMCORE · HIRE · LEAD — real captures · real
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
                  ? "border-white/40 bg-white/[0.06] text-white"
                  : "border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {L(p.title, lang).toUpperCase()}
            </button>
          ))}
        </motion.div>

        <motion.div
          variants={hudPulse}
          className="relative overflow-hidden border border-white/[0.1] bg-[#060606]"
        >
          <div className="relative z-20 grid bg-[#060606] lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-white/[0.08] bg-[#060606] p-5 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-center justify-between font-mono text-[9px] tracking-[0.25em] text-white/35">
                <span>{t.index}</span>
                <span>
                  {String(active + 1).padStart(2, "0")} /{" "}
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
                    <h3 className="mt-2 font-display text-3xl font-medium tracking-tight text-white md:text-4xl">
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
                      onClick={onNavigate}
                      className="!ml-auto !max-w-none !rounded-none !px-5 !py-2.5 !text-[10px] !tracking-[0.2em]"
                    >
                      {t.open} →
                    </MagneticButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
