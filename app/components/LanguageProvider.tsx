"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Lang } from "../i18n";

export type { Lang };

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ready: boolean;
};

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = "apex-lang";

const isLang = (v: unknown): v is Lang => v === "en" || v === "ru" || v === "uk";

/** Ukrainian browser locales. */
const UK_LANG = /^(uk)([-_]|$)/i;
/** Russian / related CIS locales (not Ukrainian). */
const RU_LANG = /^(ru|be|kk|ky|uz|tg|tk|hy|az|ka)([-_]|$)/i;

const UK_TZ = /Kyiv|Kiev|Europe\/Kyiv|Europe\/Uzhgorod|Europe\/Zaporozhye/i;
const RU_TZ =
  /Moscow|Minsk|Almaty|Tashkent|Yekaterinburg|Novosibirsk|Vladivostok|Kaliningrad|Samara|Volgograd|Baku|Yerevan|Tbilisi|Ashgabat|Bishkek|Dushanbe|Chisinau|Simferopol/i;

/** Detect UI language from browser settings + timezone — never asks for geolocation. */
export function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";

  const locales = [...(navigator.languages ?? []), navigator.language ?? ""]
    .map((l) => String(l || "").trim().toLowerCase())
    .filter(Boolean);

  if (locales.some((l) => UK_LANG.test(l))) return "uk";
  if (locales.some((l) => RU_LANG.test(l))) return "ru";
  if (locales.some((l) => l.startsWith("en"))) return "en";

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (UK_TZ.test(tz)) return "uk";
    if (RU_TZ.test(tz)) return "ru";
  } catch {
    /* ignore */
  }

  return "en";
}

function applyDocumentLang(next: Lang) {
  document.documentElement.lang = next === "uk" ? "uk" : next;
}

function readBootLang(): Lang {
  if (typeof document === "undefined") return "en";
  const boot = document.documentElement.dataset.lang;
  if (isLang(boot)) return boot;
  return detectBrowserLang();
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next: Lang = "en";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) {
        next = stored;
      } else {
        next = readBootLang();
      }
    } catch {
      next = readBootLang();
    }
    setLangState(next);
    applyDocumentLang(next);
    setReady(true);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyDocumentLang(next);
  }, []);

  const value = useMemo(() => ({ lang, setLang, ready }), [lang, setLang, ready]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang must be used within LanguageProvider");
  }
  return ctx;
}
