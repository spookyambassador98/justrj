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

/**
 * RJ portfolio is English-only (copy + EN screenshots).
 * setLang is a no-op so legacy switchers stay harmless.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dataset.lang = "en";
    try {
      window.localStorage.setItem("apex-lang", "en");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setLang = useCallback((_next: Lang) => {
    /* locked to English */
  }, []);

  const value = useMemo(
    () => ({ lang: "en" as const, setLang, ready }),
    [setLang, ready]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang must be used within LanguageProvider");
  }
  return ctx;
}

export function detectBrowserLang(): Lang {
  return "en";
}
