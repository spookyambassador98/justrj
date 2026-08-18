"use client";

import { siteConfig } from "../../site.config";
import type { Lang } from "../LanguageProvider";
import { useRecruiterMode } from "../RecruiterMode";

export function HireStrip({ lang }: { lang: Lang }) {
  const { recruiterMode, toggle } = useRecruiterMode();
  const h = siteConfig.hire;

  return (
    <div className="pointer-events-auto fixed bottom-0 left-0 right-0 z-40 safe-pad-b">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 border-t border-white/[0.08] bg-[#020202]/88 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-10">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 sm:text-[10px]">
          <span className="inline-flex items-center gap-2 text-white/70">
            <span className="h-1.5 w-1.5 shrink-0 bg-white/80" />
            {h.status[lang]}
          </span>
          <span className="hidden text-white/15 sm:inline" aria-hidden>
            /
          </span>
          <span className="hidden sm:inline">{h.availability[lang]}</span>
          <span className="hidden text-white/15 md:inline" aria-hidden>
            /
          </span>
          <span className="hidden md:inline">{h.focus[lang]}</span>
          <span className="hidden text-white/15 lg:inline" aria-hidden>
            /
          </span>
          <span className="hidden lg:inline">{h.reply[lang]}</span>
        </div>

        <button
          type="button"
          onClick={toggle}
          data-cursor="cta"
          aria-pressed={recruiterMode}
          className={`shrink-0 border px-4 py-2 font-mono text-[9px] font-medium uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:text-[10px] ${
            recruiterMode
              ? "border-white/40 bg-white/[0.08] text-white"
              : "border-white/15 text-white/45 hover:border-white/30 hover:text-white/80"
          }`}
        >
          {lang === "ru"
            ? recruiterMode
              ? "Ops · ON"
              : "Ops portal"
            : lang === "uk"
              ? recruiterMode
                ? "Ops · ON"
                : "Ops portal"
              : recruiterMode
                ? "Ops · ON"
                : "Ops portal"}
        </button>
      </div>
    </div>
  );
}
