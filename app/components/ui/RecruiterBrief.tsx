"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, LockSimple } from "@phosphor-icons/react";
import { siteConfig } from "@/app/site.config";
import type { Lang } from "@/app/components/LanguageProvider";
import { MagneticButton } from "@/app/components/ui/MagneticButton";
import { L, projectsData, resolveShot } from "@/app/projects/data";
import {
  fadeRise,
  formField,
  staggerContainer,
} from "@/lib/motion";

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

const ui = {
  en: {
    kicker: "OPS PORTAL · CONFIDENTIAL",
    title: "Recruiter brief",
    lead: "Enterprise intake for hiring teams. Source access remains under NDA — same process used with serious commercial partners.",
    idle: "Ready",
    sending: "Preparing request…",
    sent: "Drafted",
    successTitle: "Request drafted",
    successBody:
      "Your mail client should open with an encrypted brief template. Send it, and you’ll hear back within the stated reply window.",
    reopen: "New request",
    submit: "Submit brief",
    submitting: "Submitting…",
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
    cases: "Case studies",
  },
  ru: {
    kicker: "OPS PORTAL · CONFIDENTIAL",
    title: "Recruiter brief",
    lead: "Корпоративный канал для hiring-команд. Исходники — только после NDA, как с серьёзными коммерческими партнёрами.",
    idle: "Готово",
    sending: "Готовлю запрос…",
    sent: "Черновик",
    successTitle: "Запрос подготовлен",
    successBody:
      "Должен открыться почтовый клиент с шаблоном брифа. Отправьте письмо — ответ в заявленном окне.",
    reopen: "Новый запрос",
    submit: "Отправить бриф",
    submitting: "Отправка…",
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
    cases: "Кейсы",
  },
  uk: {
    kicker: "OPS PORTAL · CONFIDENTIAL",
    title: "Recruiter brief",
    lead: "Корпоративний канал для hiring-команд. Сирці — лише після NDA, як із серйозними комерційними партнерами.",
    idle: "Готово",
    sending: "Готую запит…",
    sent: "Чернетка",
    successTitle: "Запит підготовлено",
    successBody:
      "Має відкритися поштовий клієнт із шаблоном брифу. Надішліть лист — відповідь у заявленому вікні.",
    reopen: "Новий запит",
    submit: "Надіслати бриф",
    submitting: "Надсилання…",
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
    cases: "Кейси",
  },
} as const;

/**
 * RecruiterBrief — enterprise confidential NDA / hiring intake terminal.
 * Liquid form choreography. No sci-fi cosplay.
 */
export function RecruiterBrief({
  lang,
  onNavigate,
}: {
  lang: Lang;
  onNavigate: (projectId?: string) => void;
}) {
  const t = ui[lang];
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const onChange = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

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
    <section
      className="paper pointer-events-auto relative z-10 mx-auto min-h-screen w-full max-w-4xl px-4 pb-28 pt-20 sm:px-6"
      aria-label="Recruiter brief"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeRise}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.32em] text-black/40">
              {siteConfig.role[lang]}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-[-0.04em] text-[#161410] sm:text-5xl">
              {siteConfig.name}
            </h1>
            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-black/55">
              {t.lead}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MagneticButton
              onClick={onNavigate}
              className="!max-w-none !rounded-none !px-5 !py-3 !text-[10px] !tracking-[0.2em]"
            >
              {t.cases}
            </MagneticButton>
          </div>
        </motion.div>

        <motion.ul
          variants={fadeRise}
          className="mb-10 divide-y divide-black/[0.08] border-y border-black/[0.12]"
        >
          {projectsData.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => onNavigate(project.id)}
                data-cursor="project"
                className="group flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-black/[0.03]"
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-white/[0.1] bg-[#0a0a0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveShot(project.image, lang)}
                    alt=""
                    className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-95"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020202]/50 to-transparent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#161410]">{L(project.title, lang)}</p>
                  <p className="mt-1 text-xs text-black/45">
                    {L(project.result, lang)}
                  </p>
                </div>
                <ArrowUpRight size={16} weight="light" className="text-white/30" />
              </button>
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeRise}
          className="overflow-hidden border border-black/[0.12] bg-[#e7e1d4]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-7">
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-black/45">
                <LockSimple size={12} weight="bold" />
                {t.kicker}
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#161410]">
                {t.title}
              </h2>
            </div>
            <span className="font-mono text-[10px] tracking-[0.22em] text-black/40">
              {status === "idle" && t.idle}
              {status === "sending" && t.sending}
              {status === "sent" && t.sent}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[320px] flex-col items-center justify-center px-6 py-14 text-center"
              >
                <h3 className="font-display text-3xl font-extrabold uppercase text-[#161410]">
                  {t.successTitle}
                </h3>
                <p className="mt-4 max-w-md text-sm font-light text-black/50">
                  {t.successBody}
                </p>
                <MagneticButton
                  onClick={() => {
                    setForm(INITIAL);
                    setStatus("idle");
                  }}
                  className="mt-8 !max-w-none !rounded-none !px-6 !py-3 !text-[10px] !tracking-[0.2em]"
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
                    { key: "email" as const, ph: "you@company.com", type: "email" },
                    { key: "role" as const, ph: "Recruiter / CTO" },
                  ] as const
                ).map((field) => (
                  <motion.div
                    key={field.key}
                    variants={formField}
                    className={`border-b border-black/[0.08] p-5 sm:p-6 ${
                      focused === field.key ? "bg-black/[0.03]" : ""
                    }`}
                  >
                    <label className="mb-3 block font-mono text-[10px] tracking-[0.24em] text-black/40">
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
                      className="w-full bg-transparent text-sm text-[#161410] outline-none placeholder:text-black/25"
                    />
                  </motion.div>
                ))}

                <motion.div
                  variants={formField}
                  className="border-b border-black/[0.08] p-5 sm:p-6 md:col-span-2"
                >
                  <label className="mb-3 block font-mono text-[10px] tracking-[0.24em] text-black/40">
                    {t.fields.intent}
                  </label>
                  <select
                    value={form.intent}
                    onChange={(e) => onChange("intent", e.target.value)}
                    className="w-full appearance-none bg-transparent font-mono text-sm tracking-[0.12em] text-[#161410] outline-none"
                  >
                    {Object.entries(t.intents).map(([value, label]) => (
                      <option key={value} value={value} className="bg-[#ece7dc]">
                        {label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  variants={formField}
                  className="border-b border-black/[0.08] p-5 sm:p-6 md:col-span-2"
                >
                  <label className="mb-3 block font-mono text-[10px] tracking-[0.24em] text-black/40">
                    {t.fields.brief}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.brief}
                    onChange={(e) => onChange("brief", e.target.value)}
                    onFocus={() => setFocused("brief")}
                    onBlur={() => setFocused(null)}
                    placeholder="Role, timeline, compensation band, NDA needs…"
                    className="w-full resize-none bg-transparent text-sm leading-relaxed text-[#161410] outline-none placeholder:text-black/25"
                  />
                </motion.div>

                <motion.div
                  variants={formField}
                  className="flex flex-col gap-4 p-6 md:col-span-2 md:flex-row md:items-center md:justify-between md:p-8"
                >
                  <p className="max-w-md font-mono text-[9px] leading-relaxed tracking-[0.14em] text-black/40">
                    {t.legal}
                  </p>
                  <MagneticButton
                    type="submit"
                    className="!max-w-none !min-w-[180px] !rounded-none !px-8 !py-4 !text-[10px] !tracking-[0.24em]"
                  >
                    {status === "sending" ? t.submitting : t.submit}
                  </MagneticButton>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
