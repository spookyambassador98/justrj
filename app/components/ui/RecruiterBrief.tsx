"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LockSimple, X } from "@phosphor-icons/react";
import { siteConfig } from "@/app/site.config";
import type { Lang } from "@/app/components/LanguageProvider";
import { MagneticButton } from "@/app/components/ui/MagneticButton";
import { fadeRise, formField, staggerContainer } from "@/lib/motion";

type FormState = {
  name: string;
  organization: string;
  email: string;
  role: string;
  intent: string;
  brief: string;
};

const INITIAL: FormState = {
  name: "",
  organization: "",
  email: "",
  role: "",
  intent: "hiring",
  brief: "",
};

const EASE = [0.16, 1, 0.3, 1] as const;

const ui = {
  en: {
    kicker: "OPS PORTAL · CONFIDENTIAL",
    title: "Recruiter brief",
    lead: "Hiring intake stays on this field. Source stays under NDA — same process as with commercial partners.",
    idle: "Ready",
    sending: "Preparing request…",
    sent: "Drafted",
    successTitle: "Request drafted",
    successBody:
      "Your mail client should open with a brief template. Send it, and you’ll hear back within the stated reply window.",
    reopen: "New request",
    submit: "Submit brief",
    submitting: "Submitting…",
    close: "Close",
    legal:
      "Submitting confirms you represent the named organization and agree that proprietary source is shared only after mutual NDA.",
    fields: {
      name: "Full name",
      organization: "Organization",
      email: "Work email",
      role: "Your role",
      intent: "Intent",
      brief: "Engagement brief",
    },
    intents: {
      hiring: "Hiring / contract",
      nda: "Source under NDA",
      collab: "Collaboration",
    },
  },
  ru: {
    kicker: "OPS PORTAL · CONFIDENTIAL",
    title: "Recruiter brief",
    lead: "Hiring-канал остаётся на этом поле. Исходники — только после NDA, как с коммерческими партнёрами.",
    idle: "Готово",
    sending: "Готовлю запрос…",
    sent: "Черновик",
    successTitle: "Запрос подготовлен",
    successBody:
      "Должен открыться почтовый клиент с шаблоном брифа. Отправьте письмо — ответ в заявленном окне.",
    reopen: "Новый запрос",
    submit: "Отправить бриф",
    submitting: "Отправка…",
    close: "Закрыть",
    legal:
      "Отправка подтверждает, что вы представляете указанную организацию, а исходники раскрываются только после взаимного NDA.",
    fields: {
      name: "Имя",
      organization: "Организация",
      email: "Рабочий email",
      role: "Роль",
      intent: "Цель",
      brief: "Бриф",
    },
    intents: {
      hiring: "Найм / контракт",
      nda: "Исходники по NDA",
      collab: "Коллаборация",
    },
  },
  uk: {
    kicker: "OPS PORTAL · CONFIDENTIAL",
    title: "Recruiter brief",
    lead: "Hiring-канал лишається на цьому полі. Сирці — лише після NDA, як із комерційними партнерами.",
    idle: "Готово",
    sending: "Готую запит…",
    sent: "Чернетка",
    successTitle: "Запит підготовлено",
    successBody:
      "Має відкритися поштовий клієнт із шаблоном брифу. Надішліть лист — відповідь у заявленому вікні.",
    reopen: "Новий запит",
    submit: "Надіслати бриф",
    submitting: "Надсилання…",
    close: "Закрити",
    legal:
      "Надсилання підтверджує, що ви представляєте вказану організацію, а сирці розкриваються лише після взаємного NDA.",
    fields: {
      name: "Імʼя",
      organization: "Організація",
      email: "Робочий email",
      role: "Роль",
      intent: "Мета",
      brief: "Бриф",
    },
    intents: {
      hiring: "Найм / контракт",
      nda: "Сирці за NDA",
      collab: "Колаборація",
    },
  },
} as const;

/**
 * Recruiter brief — overlay on the same dark field.
 * Never replaces the homepage with a cream dossier.
 */
export function RecruiterBrief({
  lang,
  open,
  onClose,
}: {
  lang: Lang;
  open: boolean;
  onClose: () => void;
}) {
  const t = ui[lang];
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const onChange = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");

    const intentLabel =
      t.intents[form.intent as keyof typeof t.intents] ?? form.intent;

    const body = [
      "Recruiter brief / confidential intake",
      `Intent: ${intentLabel}`,
      `Name: ${form.name}`,
      `Organization: ${form.organization}`,
      `Role: ${form.role}`,
      `Email: ${form.email}`,
      "",
      form.brief,
    ].join("\n");

    await new Promise((r) => setTimeout(r, 700));

    window.location.href = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(
      `[Brief] ${intentLabel} — ${form.organization || form.name}`
    )}&body=${encodeURIComponent(body)}`;

    setStatus("sent");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[400] flex items-start justify-center overflow-y-auto overscroll-contain px-4 py-10 [isolation:isolate]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <motion.button
            type="button"
            aria-label={t.close}
            className="absolute inset-0 bg-black/92 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ops-brief-title"
            className="relative z-10 my-auto w-full max-w-2xl overflow-hidden border border-white/[0.12] bg-[#080705] shadow-[0_40px_140px_rgba(0,0,0,0.85)]"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--filament)]/50 to-transparent"
            />

            <button
              type="button"
              onClick={onClose}
              data-cursor="cta"
              className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:text-white"
              aria-label={t.close}
            >
              <X size={16} weight="light" />
            </button>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="px-6 pb-6 pt-8 sm:px-8"
            >
              <motion.div variants={fadeRise} className="pr-10">
                <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.32em] text-[color:var(--filament)]/70">
                  <LockSimple size={12} weight="bold" />
                  {t.kicker}
                </p>
                <h2
                  id="ops-brief-title"
                  className="mt-3 font-display text-[1.85rem] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-[2.2rem]"
                >
                  {t.title}
                </h2>
                <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-white/55">
                  {t.lead}
                </p>
              </motion.div>

              <motion.div
                variants={fadeRise}
                className="mt-8 overflow-hidden border border-white/[0.1]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-white/40">
                    {status === "idle" && t.idle}
                    {status === "sending" && t.sending}
                    {status === "sent" && t.sent}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {status === "sent" ? (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center"
                    >
                      <h3 className="font-display text-2xl font-extrabold uppercase text-white">
                        {t.successTitle}
                      </h3>
                      <p className="mt-4 max-w-md text-sm font-light text-white/50">
                        {t.successBody}
                      </p>
                      <MagneticButton
                        onClick={() => {
                          setForm(INITIAL);
                          setStatus("idle");
                        }}
                        className="mt-8"
                      >
                        {t.reopen}
                      </MagneticButton>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid md:grid-cols-2"
                    >
                      {(
                        [
                          { key: "name" as const, ph: "Jane Doe" },
                          { key: "organization" as const, ph: "Company" },
                          {
                            key: "email" as const,
                            ph: "you@company.com",
                            type: "email",
                          },
                          { key: "role" as const, ph: "Recruiter / CTO" },
                        ] as const
                      ).map((field) => (
                        <motion.div
                          key={field.key}
                          variants={formField}
                          className={`border-b border-white/[0.08] p-5 ${
                            focused === field.key ? "bg-white/[0.03]" : ""
                          }`}
                        >
                          <label className="mb-3 block font-mono text-[10px] tracking-[0.24em] text-white/40">
                            {t.fields[field.key]}
                          </label>
                          <input
                            required
                            type={"type" in field ? field.type : "text"}
                            value={form[field.key]}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            onFocus={() => setFocused(field.key)}
                            onBlur={() => setFocused(null)}
                            placeholder={field.ph}
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                          />
                        </motion.div>
                      ))}

                      <motion.div
                        variants={formField}
                        className="border-b border-white/[0.08] p-5 md:col-span-2"
                      >
                        <label className="mb-3 block font-mono text-[10px] tracking-[0.24em] text-white/40">
                          {t.fields.intent}
                        </label>
                        <select
                          value={form.intent}
                          onChange={(e) => onChange("intent", e.target.value)}
                          className="w-full appearance-none bg-transparent font-mono text-sm tracking-[0.12em] text-white outline-none"
                        >
                          {Object.entries(t.intents).map(([value, label]) => (
                            <option key={value} value={value} className="bg-[#080705]">
                              {label}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div
                        variants={formField}
                        className="border-b border-white/[0.08] p-5 md:col-span-2"
                      >
                        <label className="mb-3 block font-mono text-[10px] tracking-[0.24em] text-white/40">
                          {t.fields.brief}
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={form.brief}
                          onChange={(e) => onChange("brief", e.target.value)}
                          onFocus={() => setFocused("brief")}
                          onBlur={() => setFocused(null)}
                          placeholder="Role, timeline, compensation band, NDA needs…"
                          className="w-full resize-none bg-transparent text-sm leading-relaxed text-white outline-none placeholder:text-white/25"
                        />
                      </motion.div>

                      <motion.div
                        variants={formField}
                        className="flex flex-col gap-4 p-5 md:col-span-2 md:flex-row md:items-center md:justify-between"
                      >
                        <p className="max-w-md font-mono text-[9px] leading-relaxed tracking-[0.14em] text-white/35">
                          {t.legal}
                        </p>
                        <MagneticButton type="submit">
                          {status === "sending" ? t.submitting : t.submit}
                        </MagneticButton>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
