"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LockSimple, X } from "@phosphor-icons/react";
import type { Lang } from "./LanguageProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  en: {
    kicker: "HOLD",
    title: "Walked during the interview",
    lead: "Those systems stay off this site — no names, no screens, no live URL. I open them in the interview, not in the portfolio.",
    close: "Close",
  },
  ru: {
    kicker: "HOLD",
    title: "Разбираем на интервью",
    lead: "Эти системы сюда не выкладываю — без имён, экранов и live-ссылок. Открываю их на интервью, не в портфолио.",
    close: "Закрыть",
  },
  uk: {
    kicker: "HOLD",
    title: "Розбираємо на інтерв’ю",
    lead: "Ці системи сюди не викладаю — без імен, екранів і live-посилань. Відкриваю їх на інтерв’ю, не в портфоліо.",
    close: "Закрити",
  },
} as const;

export function NdaRequestOverlay({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}) {
  const t = copy[lang] ?? copy.en;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[400] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <motion.button
            type="button"
            aria-label={t.close}
            className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nda-hold-title"
            className="relative z-10 w-full max-w-md overflow-hidden border border-white/[0.1] bg-[#0a0908] px-7 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"
            />

            <button
              type="button"
              onClick={onClose}
              data-cursor="cta"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:text-white"
              aria-label={t.close}
            >
              <X size={16} weight="light" />
            </button>

            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-orange-300/25 bg-orange-300/[0.06] text-orange-200/90">
              <LockSimple size={22} weight="light" />
            </div>

            <p className="font-mono text-[10px] tracking-[0.32em] text-orange-200/55">
              {t.kicker}
            </p>
            <h2
              id="nda-hold-title"
              className="mt-3 max-w-[16ch] font-display text-[1.85rem] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-white"
            >
              {t.title}
            </h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-white/55">
              {t.lead}
            </p>

            <button
              type="button"
              onClick={onClose}
              data-cursor="cta"
              className="mt-8 border border-white/20 px-5 py-2.5 font-mono text-[10px] tracking-[0.22em] text-white/75 transition-colors hover:border-white/40 hover:text-white"
            >
              {t.close}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
