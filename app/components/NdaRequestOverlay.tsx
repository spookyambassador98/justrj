"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockSimple, X } from "@phosphor-icons/react";
import { siteConfig } from "../site.config";
import type { Lang } from "./LanguageProvider";
import { MagneticButton } from "./ui/MagneticButton";

const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  en: {
    title: "Source access under NDA",
    lead: "Commercial B2B systems stay private. I share repositories only after a short NDA — same process used with serious hiring teams.",
    stepsTitle: "How it works",
    steps: [
      "You send company + role + work email",
      "I reply with a one-page NDA (or yours)",
      "After signature — private GitHub access / walkthrough",
    ],
    name: "Full name",
    company: "Company",
    role: "Your role",
    email: "Work email",
    note: "Optional note",
    notePh: "Which project (Orbital, Foamcore…) and why you need source",
    submit: "Request NDA access",
    cancel: "Close",
    sent: "Request drafted in your mail client — send it and I’ll reply within 24h.",
  },
  ru: {
    title: "Исходники по NDA",
    lead: "Коммерческие B2B-системы в привате. Репозитории открываю только после короткого NDA — так же работают серьёзные hiring-команды.",
    stepsTitle: "Как это работает",
    steps: [
      "Ты пишешь компанию + роль + рабочий email",
      "Я отвечаю one-page NDA (или твоим)",
      "После подписи — private GitHub / walkthrough",
    ],
    name: "Имя",
    company: "Компания",
    role: "Твоя роль",
    email: "Рабочий email",
    note: "Комментарий",
    notePh: "Какой проект и зачем нужен исходник",
    submit: "Запросить доступ по NDA",
    cancel: "Закрыть",
    sent: "Черновик письма открыт — отправь, отвечу в течение 24ч.",
  },
  uk: {
    title: "Сирці за NDA",
    lead: "Комерційні B2B-системи в приваті. Репозиторії відкриваю лише після короткого NDA — так само працюють серйозні hiring-команди.",
    stepsTitle: "Як це працює",
    steps: [
      "Ти пишеш компанію + роль + робочий email",
      "Я відповідаю one-page NDA (або твоїм)",
      "Після підпису — private GitHub / walkthrough",
    ],
    name: "Імʼя",
    company: "Компанія",
    role: "Твоя роль",
    email: "Робочий email",
    note: "Коментар",
    notePh: "Який проєкт і навіщо потрібен сирець",
    submit: "Запросити доступ за NDA",
    cancel: "Закрити",
    sent: "Чернетка листа відкрита — надішли, відповім протягом 24г.",
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
  const t = copy[lang];
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !company.trim()) return;

    const body = [
      "NDA source access request",
      "",
      `Name: ${name.trim()}`,
      `Company: ${company.trim()}`,
      `Role: ${role.trim() || "—"}`,
      `Work email: ${email.trim()}`,
      `Note: ${note.trim() || "—"}`,
      "",
      "Please send NDA. After signature I expect private GitHub / walkthrough access.",
      "",
      `From portfolio: ${typeof window !== "undefined" ? window.location.origin : ""}`,
    ].join("\n");

    const mailto = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(
      `NDA source request — ${company.trim()}`
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto overscroll-contain px-3 py-6 safe-pad-x safe-pad-t safe-pad-b sm:px-4 sm:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <motion.div
            aria-hidden
            className="fixed inset-0 bg-[#020202]/88 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nda-title"
            className="relative z-10 my-auto w-full max-w-lg hud-frame p-5 sm:p-7"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <button
              type="button"
              onClick={onClose}
              data-cursor="cta"
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white/40 transition-colors hover:text-white"
              aria-label="Close"
            >
              <X size={16} weight="light" />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                <LockSimple size={18} weight="light" />
              </span>
              <h2
                id="nda-title"
                className="pr-8 font-display text-xl font-medium tracking-tight text-white sm:text-2xl"
              >
                {t.title}
              </h2>
            </div>

            <p className="mb-5 text-sm font-light leading-relaxed text-white/55">
              {t.lead}
            </p>

            <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/35">
              {t.stepsTitle}
            </p>
            <ol className="mb-6 list-decimal space-y-1.5 pl-4 text-sm font-light text-white/50">
              {t.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>

            {sent ? (
              <p className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-100/80">
                {t.sent}
              </p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.name}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/30"
                />
                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t.company}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/30"
                />
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={t.role}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/30"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.email}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/30"
                />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.notePh}
                  rows={3}
                  className="resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/30"
                />
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <MagneticButton
                    type="button"
                    onClick={onClose}
                    className="border-white/[0.08] bg-transparent shadow-none"
                  >
                    {t.cancel}
                  </MagneticButton>
                  <MagneticButton type="submit">{t.submit}</MagneticButton>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
