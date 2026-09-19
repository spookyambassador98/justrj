"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleNotch, Lock } from "@phosphor-icons/react";
import { useLang } from "./LanguageProvider";

const STEPS = 5;

type FormState = {
  name: string;
  company: string;
  contact_method: string;
  project_type: string;
  business_goal: string;
  key_features: string;
  references: string;
  deadline: string;
  budget: string;
  specialist_code: string;
};

const empty: FormState = {
  name: "",
  company: "",
  contact_method: "",
  project_type: "",
  business_goal: "",
  key_features: "",
  references: "",
  deadline: "",
  budget: "",
  specialist_code: "",
};

type Props = {
  /** From /brief?code=XXXX — auto-attached to the lead, locked in UI */
  referralCode?: string;
};

export default function BriefForm({ referralCode = "" }: Props) {
  const { lang } = useLang();
  const lockedCode = referralCode.trim().toUpperCase();
  const hasReferral = lockedCode.length > 0;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => ({
    ...empty,
    specialist_code: lockedCode,
  }));
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lockedCode) return;
    setForm((f) =>
      f.specialist_code === lockedCode ? f : { ...f, specialist_code: lockedCode }
    );
  }, [lockedCode]);

  const t =
    lang === "ru"
      ? {
          steps: [
            "Контакты",
            "Цели проекта",
            "Функции",
            "Сроки и бюджет",
            "Код специалиста",
          ],
          titles: [
            "Как с вами связаться?",
            "Что нужно сделать?",
            "Какой функционал важен?",
            "Сроки и бюджет",
            hasReferral ? "Ваш специалист закреплён" : "Код специалиста",
          ],
          hints: [
            "Имя, компания и удобный способ связи — чтобы мы не потеряли заявку.",
            "Опишите задачу простыми словами. Чем яснее цель — тем точнее оценка.",
            "Перечислите обязательные возможности и ссылки на сайты, которые вам нравятся.",
            "Ориентиры по срокам и бюджету помогают предложить реалистичный план.",
            hasReferral
              ? "Заявка автоматически уйдёт партнёру по этой ссылке. Менять код не нужно."
              : "Вставьте код специалиста, если он у вас есть.",
          ],
          fields: {
            name: "Ваше имя",
            company: "Компания / проект",
            contact: "Email / phone",
            projectType: "Что нужно разработать?",
            goal: "Главная задача для бизнеса",
            features: "Ключевые функции",
            refs: "Референсы (ссылки + что нравится)",
            deadline: "Желаемый срок запуска",
            budget: "Ориентировочный бюджет",
            code: "Код специалиста",
            locked: "Закреплён за партнёром",
          },
          next: "Далее",
          back: "Назад",
          send: "Отправить заявку",
          sending: "Отправляем…",
          thanks: "Заявка принята",
          thanksSub: "Мы уже видим её в админке и скоро свяжемся.",
          err: "Не удалось отправить. Попробуйте ещё раз.",
          required: "Заполните обязательные поля",
        }
      : lang === "uk"
        ? {
            steps: [
              "Контакти",
              "Цілі проєкту",
              "Функції",
              "Терміни й бюджет",
              "Код спеціаліста",
            ],
            titles: [
              "Як з вами зв’язатись?",
              "Що потрібно зробити?",
              "Який функціонал важливий?",
              "Терміни й бюджет",
              hasReferral ? "Вашого спеціаліста закріплено" : "Код спеціаліста",
            ],
            hints: [
              "Ім’я, компанія й зручний спосіб зв’язку — щоб ми не загубили заявку.",
              "Опишіть задачу простими словами. Чим ясніше мета — тим точніша оцінка.",
              "Перелічіть обов’язкові можливості та посилання на сайти, які вам подобаються.",
              "Орієнтири за термінами й бюджетом допомагають запропонувати реалістичний план.",
              hasReferral
                ? "Заявка автоматично піде партнеру за цим посиланням. Міняти код не потрібно."
                : "Вставте код спеціаліста, якщо він у вас є.",
            ],
            fields: {
              name: "Ваше ім’я",
              company: "Компанія / проєкт",
              contact: "Email / phone",
              projectType: "Що потрібно розробити?",
              goal: "Головна задача для бізнесу",
              features: "Ключові функції",
              refs: "Референси (посилання + що подобається)",
              deadline: "Бажаний термін запуску",
              budget: "Орієнтовний бюджет",
              code: "Код спеціаліста",
              locked: "Закріплено за партнером",
            },
            next: "Далі",
            back: "Назад",
            send: "Надіслати заявку",
            sending: "Надсилаємо…",
            thanks: "Заявку прийнято",
            thanksSub: "Ми вже бачимо її в адмінці й скоро зв’яжемось.",
            err: "Не вдалося надіслати. Спробуйте ще раз.",
            required: "Заповніть обов’язкові поля",
          }
        : {
            steps: ["Contact", "Goals", "Features", "Timeline", "Code"],
            titles: [
              "How do we reach you?",
              "What should we build?",
              "Which features matter?",
              "Timeline & budget",
              hasReferral ? "Your specialist is locked in" : "Specialist code",
            ],
            hints: [
              "Name, company and preferred contact — so we never lose the request.",
              "Describe the job in plain words. Clear goals → accurate estimate.",
              "List must-have features and links to sites you like.",
              "Deadlines and budget help us propose a realistic plan.",
              hasReferral
                ? "This request goes straight to the partner from this link. No need to change the code."
                : "Enter the specialist code if you have one.",
            ],
            fields: {
              name: "Your name",
              company: "Company / project",
              contact: "Email / phone",
              projectType: "What do you need built?",
              goal: "Main business goal",
              features: "Key features",
              refs: "References (links + why you like them)",
              deadline: "Target launch date",
              budget: "Approximate budget",
              code: "Specialist code",
              locked: "Assigned to partner",
            },
            next: "Next",
            back: "Back",
            send: "Submit brief",
            sending: "Sending…",
            thanks: "Brief received",
            thanksSub: "It already appears in the admin inbox. We'll reach out soon.",
            err: "Couldn't send. Please try again.",
            required: "Please fill required fields",
          };

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (key === "specialist_code" && hasReferral) return;
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const validateStep = () => {
    if (step === 0) return form.name.trim() && form.contact_method.trim();
    if (step === 1) return form.project_type.trim() && form.business_goal.trim();
    if (step === 2) return form.key_features.trim();
    if (step === 3) return form.deadline.trim() && form.budget.trim();
    return true;
  };

  const goNext = () => {
    if (!validateStep()) {
      setError(t.required);
      return;
    }
    setError("");
    setStep((s) => Math.min(STEPS - 1, s + 1));
  };

  const submit = async () => {
    if (!validateStep()) {
      setError(t.required);
      return;
    }
    setSending(true);
    setError("");
    try {
      const payload = {
        ...form,
        specialist_code: hasReferral ? lockedCode : form.specialist_code.trim(),
        lang,
      };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fail");
      setDone(true);
    } catch {
      setError(t.err);
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-white/25 focus:bg-white/[0.05]";

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl sm:rounded-[2rem] sm:p-12"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
          <Check className="text-white/80" size={28} weight="light" />
        </div>
        <h2 className="font-serif text-2xl italic text-white sm:text-3xl">{t.thanks}</h2>
        <p className="mt-3 text-white/50">{t.thanksSub}</p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-10 flex gap-2">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-white/70 to-white/35"
              initial={false}
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.45 }}
            />
          </div>
        ))}
      </div>

      <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/35">
        {t.steps[step]} · {step + 1}/{STEPS}
      </p>
      <h2 className="font-serif text-2xl italic text-white sm:text-3xl md:text-4xl">{t.titles[step]}</h2>
      <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/45 sm:text-sm">{t.hints[step]}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="mt-10 space-y-4"
        >
          {step === 0 && (
            <>
              <input className={inputClass} placeholder={t.fields.name} value={form.name} onChange={set("name")} />
              <input className={inputClass} placeholder={t.fields.company} value={form.company} onChange={set("company")} />
              <input className={inputClass} placeholder={t.fields.contact} value={form.contact_method} onChange={set("contact_method")} />
            </>
          )}
          {step === 1 && (
            <>
              <textarea className={`${inputClass} min-h-[110px] resize-none`} placeholder={t.fields.projectType} value={form.project_type} onChange={set("project_type")} />
              <textarea className={`${inputClass} min-h-[110px] resize-none`} placeholder={t.fields.goal} value={form.business_goal} onChange={set("business_goal")} />
            </>
          )}
          {step === 2 && (
            <>
              <textarea className={`${inputClass} min-h-[120px] resize-none`} placeholder={t.fields.features} value={form.key_features} onChange={set("key_features")} />
              <textarea className={`${inputClass} min-h-[100px] resize-none`} placeholder={t.fields.refs} value={form.references} onChange={set("references")} />
            </>
          )}
          {step === 3 && (
            <>
              <input className={inputClass} placeholder={t.fields.deadline} value={form.deadline} onChange={set("deadline")} />
              <input className={inputClass} placeholder={t.fields.budget} value={form.budget} onChange={set("budget")} />
            </>
          )}
          {step === 4 &&
            (hasReferral ? (
              <div className="flex items-center gap-3 rounded-2xl border border-violet-400/25 bg-violet-400/[0.06] px-5 py-4">
                <Lock size={16} weight="light" className="shrink-0 text-violet-300/80" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{t.fields.locked}</p>
                  <p className="mt-1 font-mono text-lg tracking-[0.18em] text-violet-200">{lockedCode}</p>
                </div>
              </div>
            ) : (
              <input
                className={inputClass}
                placeholder={t.fields.code}
                value={form.specialist_code}
                onChange={set("specialist_code")}
              />
            ))}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-4 text-sm text-rose-300/90">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3 sm:mt-10 sm:gap-4">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="inline-flex min-h-11 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 transition hover:text-white disabled:opacity-30 sm:text-[11px] sm:tracking-[0.22em]"
        >
          <ArrowLeft size={14} weight="light" /> {t.back}
        </button>

        {step < STEPS - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition hover:border-white/30 hover:bg-white/[0.1] sm:px-6 sm:text-[11px] sm:tracking-[0.22em]"
          >
            {t.next} <ArrowRight size={14} weight="light" />
          </button>
        ) : (
          <button
            type="button"
            disabled={sending}
            onClick={submit}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/[0.1] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-white/[0.16] disabled:opacity-50 sm:px-6 sm:text-[11px] sm:tracking-[0.22em]"
          >
            {sending ? <CircleNotch size={14} weight="light" className="animate-spin" /> : null}
            {sending ? t.sending : t.send}
          </button>
        )}
      </div>
    </div>
  );
}

