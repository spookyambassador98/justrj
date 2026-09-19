"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { MagneticButton } from "./MagneticButton";
import type { Lang } from "../LanguageProvider";
import { L, projectsData } from "@/app/projects/data";

export function ShowcaseBlock({
  lang,
  onNavigate,
}: {
  lang: Lang;
  onNavigate: (projectId?: string) => void;
}) {
  return (
    <div className="mt-24 w-full pointer-events-auto md:mt-40" id="showcase">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="mb-10 text-center md:mb-14"
      >
        <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 backdrop-blur-sm">
          {lang === "ru" ? "Кейсы" : lang === "uk" ? "Кейси" : "Work"}
        </span>
        <h2 className="mt-6 bg-gradient-to-b from-white to-white/45 bg-clip-text text-3xl font-light text-transparent sm:text-4xl md:text-5xl">
          {lang === "ru"
            ? "Системы, которые я собрал"
            : lang === "uk"
              ? "Системи, які я зібрав"
              : "Systems I shipped"}
        </h2>
      </motion.div>

      <div className="mb-12 grid grid-cols-1 gap-5 sm:gap-6 md:mb-16 md:grid-cols-2 lg:grid-cols-4">
        {projectsData.map((proj, idx) => (
          <motion.button
            key={proj.id}
            type="button"
            onClick={() => onNavigate(proj.id)}
            data-cursor="project"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              duration: 0.55,
              delay: idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true }}
            className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-gradient-to-b from-white/[0.045] to-[#020202]/70 p-6 text-left shadow-[0_0_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl will-change-transform sm:min-h-[280px] sm:rounded-[1.75rem] sm:p-7"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400/[0.04] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative z-10">
              <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-violet-300/55">
                {proj.year} · {L(proj.result, lang)}
              </p>
              <h3 className="mb-3 text-xl font-medium tracking-wide text-white/90 transition-colors group-hover:text-violet-100 sm:text-2xl">
                {L(proj.title, lang)}
              </h3>
              <p className="text-sm font-light leading-relaxed text-white/45">
                {L(proj.hook, lang)}
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between gap-3">
              <div className="truncate pr-2 text-[10px] uppercase tracking-widest text-violet-400/60">
                {proj.tech.slice(0, 2).join(" · ")}
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 transition-all group-hover:border-violet-400/40 group-hover:bg-violet-400/15">
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-white"
                  weight="light"
                />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <MagneticButton onClick={onNavigate}>
          {lang === "ru"
            ? "Смотреть кейсы"
            : lang === "uk"
              ? "Дивитись кейси"
              : "Explore case studies"}
        </MagneticButton>
      </motion.div>
    </div>
  );
}
