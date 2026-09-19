"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import { L, type Project } from "@/app/projects/data";
import type { Lang } from "@/app/components/LanguageProvider";

export type LevelKey = "l1" | "l2" | "l3" | "nda";

export const LEVELS: { key: LevelKey; title: string }[] = [
  { key: "l1", title: "LEVEL 1 PROJECTS" },
  { key: "l2", title: "LEVEL 2 PROJECTS" },
  { key: "l3", title: "LEVEL 3 PROJECTS" },
  { key: "nda", title: "NDA PROJECTS" },
];

/** Project id → level. Anything not listed falls into NDA. */
export const PROJECT_LEVEL: Record<string, LevelKey> = {};

export const levelOf = (id: string): LevelKey => PROJECT_LEVEL[id] ?? "nda";

const curtainEase = [0.16, 1, 0.3, 1] as const;

export function HudLevelIndex({
  featured,
  active,
  openLevel,
  lang,
  onToggleLevel,
  onSelect,
}: {
  featured: Project[];
  active: number | null;
  openLevel: LevelKey | null;
  lang: Lang;
  onToggleLevel: (key: LevelKey | null) => void;
  onSelect: (index: number) => void;
}) {
  const grouped: Record<LevelKey, { p: Project; i: number }[]> = {
    l1: [],
    l2: [],
    l3: [],
    nda: [],
  };
  featured.forEach((p, i) => grouped[levelOf(p.id)].push({ p, i }));

  return (
    <div className="space-y-2">
      {LEVELS.map(({ key, title }) => {
        const items = grouped[key];
        const open = openLevel === key;
        const isNda = key === "nda";
        const hasActive = items.some(({ i }) => i === active);
        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => onToggleLevel(open ? null : key)}
              aria-expanded={open}
              data-cursor="cta"
              className={`hud-node relative flex items-center justify-between gap-2 overflow-hidden ${
                open ? (isNda ? "is-open is-nda" : "is-open") : ""
              }`}
            >
              <motion.span
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 w-full ${
                  isNda
                    ? "bg-gradient-to-r from-orange-400/15 to-transparent"
                    : "bg-gradient-to-r from-violet-300/15 to-transparent"
                }`}
                initial={false}
                animate={{ x: open ? "0%" : "-100%" }}
                transition={{ duration: 0.7, ease: curtainEase }}
              />
              <span className="relative z-10 truncate">
                {title}
                {hasActive && !open ? (
                  <span className="ml-2 inline-block h-1 w-1 rounded-full bg-white/70 align-middle" />
                ) : null}
              </span>
              <span className="relative z-10 flex shrink-0 items-center gap-2">
                <span className="text-white/30">
                  {String(items.length).padStart(2, "0")}
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: curtainEase }}
                  className="flex"
                >
                  <CaretDown size={11} weight="light" />
                </motion.span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="curtain"
                  initial={{ height: 0, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ height: "auto", opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ height: 0, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  transition={{ duration: 0.7, ease: curtainEase }}
                  className="overflow-hidden"
                >
                  {items.length === 0 ? (
                    <p className="border border-dashed border-white/[0.08] px-3 py-4 text-center font-mono text-[9px] leading-relaxed tracking-[0.16em] text-white/30">
                      COMING SOON
                    </p>
                  ) : (
                    <motion.ul
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: { staggerChildren: 0.06, delayChildren: 0.12 },
                        },
                      }}
                      className="space-y-1 pt-1"
                    >
                      {items.map(({ p, i }) => (
                        <motion.li
                          key={p.id}
                          variants={{
                            hidden: { opacity: 0, x: -12 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          transition={{ duration: 0.45, ease: curtainEase }}
                        >
                          <button
                            type="button"
                            onClick={() => onSelect(i)}
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
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
