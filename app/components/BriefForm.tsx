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
  /** From /brief?code=XXXX â€” auto-attached to the lead, locked in UI */
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
            "ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ñ‹",
            "Ð¦ÐµÐ»Ð¸ Ð¿Ñ€Ð¾ÐµÐºÑ‚Ð°",
            "Ð¤ÑƒÐ½ÐºÑ†Ð¸Ð¸",
            "Ð¡Ñ€Ð¾ÐºÐ¸ Ð¸ Ð±ÑŽÐ´Ð¶ÐµÑ‚",
            "ÐšÐ¾Ð´ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸ÑÑ‚Ð°",
          ],
          titles: [
            "ÐšÐ°Ðº Ñ Ð²Ð°Ð¼Ð¸ ÑÐ²ÑÐ·Ð°Ñ‚ÑŒÑÑ?",
            "Ð§Ñ‚Ð¾ Ð½ÑƒÐ¶Ð½Ð¾ ÑÐ´ÐµÐ»Ð°Ñ‚ÑŒ?",
            "ÐšÐ°ÐºÐ¾Ð¹ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¾Ð½Ð°Ð» Ð²Ð°Ð¶ÐµÐ½?",
            "Ð¡Ñ€Ð¾ÐºÐ¸ Ð¸ Ð±ÑŽÐ´Ð¶ÐµÑ‚",
            hasReferral ? "Ð’Ð°Ñˆ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸ÑÑ‚ Ð·Ð°ÐºÑ€ÐµÐ¿Ð»Ñ‘Ð½" : "ÐšÐ¾Ð´ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸ÑÑ‚Ð°",
          ],
          hints: [
            "Ð˜Ð¼Ñ, ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ñ Ð¸ ÑƒÐ´Ð¾Ð±Ð½Ñ‹Ð¹ ÑÐ¿Ð¾ÑÐ¾Ð± ÑÐ²ÑÐ·Ð¸ â€” Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¼Ñ‹ Ð½Ðµ Ð¿Ð¾Ñ‚ÐµÑ€ÑÐ»Ð¸ Ð·Ð°ÑÐ²ÐºÑƒ.",
            "ÐžÐ¿Ð¸ÑˆÐ¸Ñ‚Ðµ Ð·Ð°Ð´Ð°Ñ‡Ñƒ Ð¿Ñ€Ð¾ÑÑ‚Ñ‹Ð¼Ð¸ ÑÐ»Ð¾Ð²Ð°Ð¼Ð¸. Ð§ÐµÐ¼ ÑÑÐ½ÐµÐµ Ñ†ÐµÐ»ÑŒ â€” Ñ‚ÐµÐ¼ Ñ‚Ð¾Ñ‡Ð½ÐµÐµ Ð¾Ñ†ÐµÐ½ÐºÐ°.",
            "ÐŸÐµÑ€ÐµÑ‡Ð¸ÑÐ»Ð¸Ñ‚Ðµ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸ Ð¸ ÑÑÑ‹Ð»ÐºÐ¸ Ð½Ð° ÑÐ°Ð¹Ñ‚Ñ‹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð²Ð°Ð¼ Ð½Ñ€Ð°Ð²ÑÑ‚ÑÑ.",
            "ÐžÑ€Ð¸ÐµÐ½Ñ‚Ð¸Ñ€Ñ‹ Ð¿Ð¾ ÑÑ€Ð¾ÐºÐ°Ð¼ Ð¸ Ð±ÑŽÐ´Ð¶ÐµÑ‚Ñƒ Ð¿Ð¾Ð¼Ð¾Ð³Ð°ÑŽÑ‚ Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶Ð¸Ñ‚ÑŒ Ñ€ÐµÐ°Ð»Ð¸ÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ð¹ Ð¿Ð»Ð°Ð½.",
            hasReferral
              ? "Ð—Ð°ÑÐ²ÐºÐ° Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸ ÑƒÐ¹Ð´Ñ‘Ñ‚ Ð¿Ð°Ñ€Ñ‚Ð½Ñ‘Ñ€Ñƒ Ð¿Ð¾ ÑÑ‚Ð¾Ð¹ ÑÑÑ‹Ð»ÐºÐµ. ÐœÐµÐ½ÑÑ‚ÑŒ ÐºÐ¾Ð´ Ð½Ðµ Ð½ÑƒÐ¶Ð½Ð¾."
              : "Ð’ÑÑ‚Ð°Ð²ÑŒÑ‚Ðµ ÐºÐ¾Ð´ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸ÑÑ‚Ð°, ÐµÑÐ»Ð¸ Ð¾Ð½ Ñƒ Ð²Ð°Ñ ÐµÑÑ‚ÑŒ.",
          ],
          fields: {
            name: "Ð’Ð°ÑˆÐµ Ð¸Ð¼Ñ",
            company: "ÐšÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ñ / Ð¿Ñ€Ð¾ÐµÐºÑ‚",
            contact: "Email / phone",
            projectType: "Ð§Ñ‚Ð¾ Ð½ÑƒÐ¶Ð½Ð¾ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ?",
            goal: "Ð“Ð»Ð°Ð²Ð½Ð°Ñ Ð·Ð°Ð´Ð°Ñ‡Ð° Ð´Ð»Ñ Ð±Ð¸Ð·Ð½ÐµÑÐ°",
            features: "ÐšÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸",
            refs: "Ð ÐµÑ„ÐµÑ€ÐµÐ½ÑÑ‹ (ÑÑÑ‹Ð»ÐºÐ¸ + Ñ‡Ñ‚Ð¾ Ð½Ñ€Ð°Ð²Ð¸Ñ‚ÑÑ)",
            deadline: "Ð–ÐµÐ»Ð°ÐµÐ¼Ñ‹Ð¹ ÑÑ€Ð¾Ðº Ð·Ð°Ð¿ÑƒÑÐºÐ°",
            budget: "ÐžÑ€Ð¸ÐµÐ½Ñ‚Ð¸Ñ€Ð¾Ð²Ð¾Ñ‡Ð½Ñ‹Ð¹ Ð±ÑŽÐ´Ð¶ÐµÑ‚",
            code: "ÐšÐ¾Ð´ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸ÑÑ‚Ð°",
            locked: "Ð—Ð°ÐºÑ€ÐµÐ¿Ð»Ñ‘Ð½ Ð·Ð° Ð¿Ð°Ñ€Ñ‚Ð½Ñ‘Ñ€Ð¾Ð¼",
          },
          next: "Ð”Ð°Ð»ÐµÐµ",
          back: "ÐÐ°Ð·Ð°Ð´",
          send: "ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ Ð·Ð°ÑÐ²ÐºÑƒ",
          sending: "ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÑÐµÐ¼â€¦",
          thanks: "Ð—Ð°ÑÐ²ÐºÐ° Ð¿Ñ€Ð¸Ð½ÑÑ‚Ð°",
          thanksSub: "ÐœÑ‹ ÑƒÐ¶Ðµ Ð²Ð¸Ð´Ð¸Ð¼ ÐµÑ‘ Ð² Ð°Ð´Ð¼Ð¸Ð½ÐºÐµ Ð¸ ÑÐºÐ¾Ñ€Ð¾ ÑÐ²ÑÐ¶ÐµÐ¼ÑÑ.",
          err: "ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ. ÐŸÐ¾Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ ÐµÑ‰Ñ‘ Ñ€Ð°Ð·.",
          required: "Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¿Ð¾Ð»Ñ",
        }
      : lang === "uk"
        ? {
            steps: [
              "ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ð¸",
              "Ð¦Ñ–Ð»Ñ– Ð¿Ñ€Ð¾Ñ”ÐºÑ‚Ñƒ",
              "Ð¤ÑƒÐ½ÐºÑ†Ñ–Ñ—",
              "Ð¢ÐµÑ€Ð¼Ñ–Ð½Ð¸ Ð¹ Ð±ÑŽÐ´Ð¶ÐµÑ‚",
              "ÐšÐ¾Ð´ ÑÐ¿ÐµÑ†Ñ–Ð°Ð»Ñ–ÑÑ‚Ð°",
            ],
            titles: [
              "Ð¯Ðº Ð· Ð²Ð°Ð¼Ð¸ Ð·Ð²â€™ÑÐ·Ð°Ñ‚Ð¸ÑÑŒ?",
              "Ð©Ð¾ Ð¿Ð¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾ Ð·Ñ€Ð¾Ð±Ð¸Ñ‚Ð¸?",
              "Ð¯ÐºÐ¸Ð¹ Ñ„ÑƒÐ½ÐºÑ†Ñ–Ð¾Ð½Ð°Ð» Ð²Ð°Ð¶Ð»Ð¸Ð²Ð¸Ð¹?",
              "Ð¢ÐµÑ€Ð¼Ñ–Ð½Ð¸ Ð¹ Ð±ÑŽÐ´Ð¶ÐµÑ‚",
              hasReferral ? "Ð’Ð°ÑˆÐ¾Ð³Ð¾ ÑÐ¿ÐµÑ†Ñ–Ð°Ð»Ñ–ÑÑ‚Ð° Ð·Ð°ÐºÑ€Ñ–Ð¿Ð»ÐµÐ½Ð¾" : "ÐšÐ¾Ð´ ÑÐ¿ÐµÑ†Ñ–Ð°Ð»Ñ–ÑÑ‚Ð°",
            ],
            hints: [
              "Ð†Ð¼â€™Ñ, ÐºÐ¾Ð¼Ð¿Ð°Ð½Ñ–Ñ Ð¹ Ð·Ñ€ÑƒÑ‡Ð½Ð¸Ð¹ ÑÐ¿Ð¾ÑÑ–Ð± Ð·Ð²â€™ÑÐ·ÐºÑƒ â€” Ñ‰Ð¾Ð± Ð¼Ð¸ Ð½Ðµ Ð·Ð°Ð³ÑƒÐ±Ð¸Ð»Ð¸ Ð·Ð°ÑÐ²ÐºÑƒ.",
              "ÐžÐ¿Ð¸ÑˆÑ–Ñ‚ÑŒ Ð·Ð°Ð´Ð°Ñ‡Ñƒ Ð¿Ñ€Ð¾ÑÑ‚Ð¸Ð¼Ð¸ ÑÐ»Ð¾Ð²Ð°Ð¼Ð¸. Ð§Ð¸Ð¼ ÑÑÐ½Ñ–ÑˆÐµ Ð¼ÐµÑ‚Ð° â€” Ñ‚Ð¸Ð¼ Ñ‚Ð¾Ñ‡Ð½Ñ–ÑˆÐ° Ð¾Ñ†Ñ–Ð½ÐºÐ°.",
              "ÐŸÐµÑ€ÐµÐ»Ñ–Ñ‡Ñ–Ñ‚ÑŒ Ð¾Ð±Ð¾Ð²â€™ÑÐ·ÐºÐ¾Ð²Ñ– Ð¼Ð¾Ð¶Ð»Ð¸Ð²Ð¾ÑÑ‚Ñ– Ñ‚Ð° Ð¿Ð¾ÑÐ¸Ð»Ð°Ð½Ð½Ñ Ð½Ð° ÑÐ°Ð¹Ñ‚Ð¸, ÑÐºÑ– Ð²Ð°Ð¼ Ð¿Ð¾Ð´Ð¾Ð±Ð°ÑŽÑ‚ÑŒÑÑ.",
              "ÐžÑ€Ñ–Ñ”Ð½Ñ‚Ð¸Ñ€Ð¸ Ð·Ð° Ñ‚ÐµÑ€Ð¼Ñ–Ð½Ð°Ð¼Ð¸ Ð¹ Ð±ÑŽÐ´Ð¶ÐµÑ‚Ð¾Ð¼ Ð´Ð¾Ð¿Ð¾Ð¼Ð°Ð³Ð°ÑŽÑ‚ÑŒ Ð·Ð°Ð¿Ñ€Ð¾Ð¿Ð¾Ð½ÑƒÐ²Ð°Ñ‚Ð¸ Ñ€ÐµÐ°Ð»Ñ–ÑÑ‚Ð¸Ñ‡Ð½Ð¸Ð¹ Ð¿Ð»Ð°Ð½.",
              hasReferral
                ? "Ð—Ð°ÑÐ²ÐºÐ° Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡Ð½Ð¾ Ð¿Ñ–Ð´Ðµ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ñƒ Ð·Ð° Ñ†Ð¸Ð¼ Ð¿Ð¾ÑÐ¸Ð»Ð°Ð½Ð½ÑÐ¼. ÐœÑ–Ð½ÑÑ‚Ð¸ ÐºÐ¾Ð´ Ð½Ðµ Ð¿Ð¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾."
                : "Ð’ÑÑ‚Ð°Ð²Ñ‚Ðµ ÐºÐ¾Ð´ ÑÐ¿ÐµÑ†Ñ–Ð°Ð»Ñ–ÑÑ‚Ð°, ÑÐºÑ‰Ð¾ Ð²Ñ–Ð½ Ñƒ Ð²Ð°Ñ Ñ”.",
            ],
            fields: {
              name: "Ð’Ð°ÑˆÐµ Ñ–Ð¼â€™Ñ",
              company: "ÐšÐ¾Ð¼Ð¿Ð°Ð½Ñ–Ñ / Ð¿Ñ€Ð¾Ñ”ÐºÑ‚",
              contact: "Email / phone",
              projectType: "Ð©Ð¾ Ð¿Ð¾Ñ‚Ñ€Ñ–Ð±Ð½Ð¾ Ñ€Ð¾Ð·Ñ€Ð¾Ð±Ð¸Ñ‚Ð¸?",
              goal: "Ð“Ð¾Ð»Ð¾Ð²Ð½Ð° Ð·Ð°Ð´Ð°Ñ‡Ð° Ð´Ð»Ñ Ð±Ñ–Ð·Ð½ÐµÑÑƒ",
              features: "ÐšÐ»ÑŽÑ‡Ð¾Ð²Ñ– Ñ„ÑƒÐ½ÐºÑ†Ñ–Ñ—",
              refs: "Ð ÐµÑ„ÐµÑ€ÐµÐ½ÑÐ¸ (Ð¿Ð¾ÑÐ¸Ð»Ð°Ð½Ð½Ñ + Ñ‰Ð¾ Ð¿Ð¾Ð´Ð¾Ð±Ð°Ñ”Ñ‚ÑŒÑÑ)",
              deadline: "Ð‘Ð°Ð¶Ð°Ð½Ð¸Ð¹ Ñ‚ÐµÑ€Ð¼Ñ–Ð½ Ð·Ð°Ð¿ÑƒÑÐºÑƒ",
              budget: "ÐžÑ€Ñ–Ñ”Ð½Ñ‚Ð¾Ð²Ð½Ð¸Ð¹ Ð±ÑŽÐ´Ð¶ÐµÑ‚",
              code: "ÐšÐ¾Ð´ ÑÐ¿ÐµÑ†Ñ–Ð°Ð»Ñ–ÑÑ‚Ð°",
              locked: "Ð—Ð°ÐºÑ€Ñ–Ð¿Ð»ÐµÐ½Ð¾ Ð·Ð° Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ð¾Ð¼",
            },
            next: "Ð”Ð°Ð»Ñ–",
            back: "ÐÐ°Ð·Ð°Ð´",
            send: "ÐÐ°Ð´Ñ–ÑÐ»Ð°Ñ‚Ð¸ Ð·Ð°ÑÐ²ÐºÑƒ",
            sending: "ÐÐ°Ð´ÑÐ¸Ð»Ð°Ñ”Ð¼Ð¾â€¦",
            thanks: "Ð—Ð°ÑÐ²ÐºÑƒ Ð¿Ñ€Ð¸Ð¹Ð½ÑÑ‚Ð¾",
            thanksSub: "ÐœÐ¸ Ð²Ð¶Ðµ Ð±Ð°Ñ‡Ð¸Ð¼Ð¾ Ñ—Ñ— Ð² Ð°Ð´Ð¼Ñ–Ð½Ñ†Ñ– Ð¹ ÑÐºÐ¾Ñ€Ð¾ Ð·Ð²â€™ÑÐ¶ÐµÐ¼Ð¾ÑÑŒ.",
            err: "ÐÐµ Ð²Ð´Ð°Ð»Ð¾ÑÑ Ð½Ð°Ð´Ñ–ÑÐ»Ð°Ñ‚Ð¸. Ð¡Ð¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ Ñ‰Ðµ Ñ€Ð°Ð·.",
            required: "Ð—Ð°Ð¿Ð¾Ð²Ð½Ñ–Ñ‚ÑŒ Ð¾Ð±Ð¾Ð²â€™ÑÐ·ÐºÐ¾Ð²Ñ– Ð¿Ð¾Ð»Ñ",
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
              "Name, company and preferred contact â€” so we never lose the request.",
              "Describe the job in plain words. Clear goals â†’ accurate estimate.",
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
            sending: "Sendingâ€¦",
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
        {t.steps[step]} Â· {step + 1}/{STEPS}
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
              <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.06] px-5 py-4">
                <Lock size={16} weight="light" className="shrink-0 text-cyan-300/80" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{t.fields.locked}</p>
                  <p className="mt-1 font-mono text-lg tracking-[0.18em] text-cyan-200">{lockedCode}</p>
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

