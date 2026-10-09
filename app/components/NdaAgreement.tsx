"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react";
import type { Lang } from "./LanguageProvider";
import { submitNdaSignature } from "@/lib/nda/sign";

const copy = {
  en: {
    kicker: "Non-disclosure",
    title: "Sign to open this case",
    lead: (name: string) =>
      `${name} stays under NDA. The screens, the build, and the live URL are confidential. Signing means you will not copy, forward, or publish them.`,
    signature: "Signature",
    company: "Company",
    signPlaceholder: "Your full name",
    companyPlaceholder: "Company",
    submit: "Sign and open",
    sending: "Sending signature",
    foot: "The signature is logged on my ops desk. No email, no list.",
    incomplete: "Sign your name and company.",
    failed: "The signature did not go through. Try again.",
    close: "Close",
  },
  ru: {
    kicker: "Соглашение NDA",
    title: "Подпись открывает кейс",
    lead: (name: string) =>
      `${name} под NDA. Экраны, сборка и live-ссылка конфиденциальны. Подпись значит, что вы не копируете, не пересылаете и не публикуете их.`,
    signature: "Подпись",
    company: "Компания",
    signPlaceholder: "Имя и фамилия",
    companyPlaceholder: "Компания",
    submit: "Подписать и открыть",
    sending: "Отправляю подпись",
    foot: "Подпись уходит на мой ops-стол. Без почты и без рассылки.",
    incomplete: "Нужны имя и компания.",
    failed: "Подпись не ушла. Попробуйте ещё раз.",
    close: "Закрыть",
  },
  uk: {
    kicker: "Угода NDA",
    title: "Підпис відкриває кейс",
    lead: (name: string) =>
      `${name} під NDA. Екрани, збірка і live-посилання конфіденційні. Підпис означає, що ви не копіюєте, не пересилаєте і не публікуєте їх.`,
    signature: "Підпис",
    company: "Компанія",
    signPlaceholder: "Ім’я та прізвище",
    companyPlaceholder: "Компанія",
    submit: "Підписати і відкрити",
    sending: "Надсилаю підпис",
    foot: "Підпис іде на мій ops-стіл. Без пошти і без розсилки.",
    incomplete: "Потрібні ім’я і компанія.",
    failed: "Підпис не пішов. Спробуйте ще раз.",
    close: "Закрити",
  },
} as const;

export function NdaAgreement({
  projectId,
  projectTitle,
  lang,
  mode,
  onSigned,
  onClose,
}: {
  projectId: string;
  projectTitle: string;
  lang: Lang;
  mode: "modal" | "inline";
  onSigned: () => void;
  onClose?: () => void;
}) {
  const t = copy[lang] ?? copy.en;
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const signed = name.replace(/\s+/g, " ").trim();
    const org = company.replace(/\s+/g, " ").trim();
    if (signed.length < 2 || org.length < 2) {
      setError(t.incomplete);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await submitNdaSignature({
        projectId,
        projectTitle,
        name: signed,
        company: org,
        path:
          typeof window === "undefined"
            ? `/projects#${projectId}`
            : `${location.pathname}${location.search}#${projectId}`,
      });
      onSigned();
    } catch {
      setError(t.failed);
      setBusy(false);
    }
  };

  const form = (
    <form
      onSubmit={submit}
      className="relative w-full max-w-lg overflow-hidden border border-orange-300/25 bg-[#080705] px-6 py-7 shadow-[0_40px_120px_rgba(0,0,0,0.65)] sm:px-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent"
      />
      {mode === "modal" && onClose ? (
        <button
          type="button"
          onClick={onClose}
          data-cursor="cta"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:text-white"
          aria-label={t.close}
        >
          <X size={16} weight="light" />
        </button>
      ) : null}

      <p className="font-mono text-[10px] tracking-[0.32em] text-orange-200/70">
        {t.kicker}
      </p>
      <h2 className="mt-3 max-w-[16ch] font-display text-[1.7rem] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-white">
        {t.title}
      </h2>
      <p className="mt-4 text-sm font-light leading-relaxed text-white/55">
        {t.lead(projectTitle)}
      </p>

      <label className="mt-7 block">
        <span className="font-mono text-[10px] tracking-[0.22em] text-white/40">
          {t.signature}
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          maxLength={80}
          required
          placeholder={t.signPlaceholder}
          className="mt-2 w-full border-0 border-b border-white/20 bg-transparent py-2 font-serif text-2xl italic text-white outline-none placeholder:text-white/20 focus:border-orange-200/60"
        />
      </label>

      <label className="mt-5 block">
        <span className="font-mono text-[10px] tracking-[0.22em] text-white/40">
          {t.company}
        </span>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          maxLength={80}
          required
          placeholder={t.companyPlaceholder}
          className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-[13px] tracking-[0.04em] text-white outline-none placeholder:text-white/25 focus:border-orange-200/40"
        />
      </label>

      {error ? (
        <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-orange-200/80">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        data-cursor="cta"
        className="mt-6 border border-orange-200/40 px-5 py-2.5 font-mono text-[10px] tracking-[0.22em] text-orange-50 transition-colors hover:border-orange-100 hover:bg-orange-300/10 disabled:opacity-40"
      >
        {busy ? t.sending : t.submit}
      </button>
      <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.08em] text-white/30">
        {t.foot}
      </p>
    </form>
  );

  if (mode === "inline") return form;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[400] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label={t.close}
        className="absolute inset-0 bg-black/88 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg">{form}</div>
    </div>
  );
}
