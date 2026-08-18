"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import BriefForm from "./BriefForm";
import type { Lang } from "./LanguageProvider";

export function BriefOverlay({
  visible,
  onClose,
  lang,
}: {
  visible: boolean;
  onClose: () => void;
  lang: Lang;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain px-3 py-6 safe-pad-x safe-pad-t safe-pad-b sm:px-4 sm:py-10 md:px-8 md:py-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            aria-hidden
            className="fixed inset-0 bg-[#020202]/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="brief-title"
            className="relative z-10 my-auto w-full max-w-2xl rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-[#0a0a0a]/95 p-5 shadow-[0_0_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-6 md:p-10"
            initial={{ opacity: 0, y: 48, scale: 0.94, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(10px)" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-20 text-white/35 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/50 md:right-7 md:top-7"
              aria-label="Close"
              data-cursor="cta"
            >
              <X size={20} weight="light" />
            </button>

            <div className="relative z-10 mb-8 pr-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/35">
                {lang === "ru"
                  ? "Project inquiry"
                  : lang === "uk"
                    ? "Project inquiry"
                    : "Project inquiry"}
              </p>
              <h3 id="brief-title" className="font-serif text-3xl italic text-white md:text-4xl">
                {lang === "ru"
                  ? "Расскажите о проекте"
                  : lang === "uk"
                    ? "Розкажіть про проєкт"
                    : "Tell me about the project"}
              </h3>
              <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-white/45">
                {lang === "ru"
                  ? "Короткий бриф — если нужен подряд, а не найм. Для оффера лучше email / LinkedIn."
                  : lang === "uk"
                    ? "Короткий бриф — якщо потрібен підряд, а не найм. Для оферу краще email / LinkedIn."
                    : "A short brief for project inquiries. For hiring, email or LinkedIn is faster."}
              </p>
            </div>

            <div className="relative z-10">
              <BriefForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
