"use client";

import { siteConfig } from "../../site.config";
import type { Lang } from "../LanguageProvider";
import { useRecruiterMode } from "../RecruiterMode";

export function HireStrip({ lang }: { lang: Lang }) {
  const { recruiterMode, toggle } = useRecruiterMode();
  const h = siteConfig.hire;

  return (
    <div className="hire-rail pointer-events-auto safe-pad-b">
      <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-3 px-[var(--grid-gutter)] py-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 sm:text-[10px]">
          <span className="inline-flex items-center gap-2 text-white/75">
            <span className="h-1.5 w-1.5 shrink-0 bg-[color:var(--filament)]" />
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
          className="filament !min-h-11 !px-4 !py-2"
        >
          {recruiterMode ? "Ops · ON" : "Ops portal"}
        </button>
      </div>
    </div>
  );
}
