"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type RecruiterCtx = {
  recruiterMode: boolean;
  setRecruiterMode: (v: boolean) => void;
  toggle: () => void;
};

const Ctx = createContext<RecruiterCtx | null>(null);
const LEGACY_KEY = "rj-recruiter-mode";

export function RecruiterModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recruiterMode, setRecruiterModeState] = useState(false);

  useEffect(() => {
    try {
      // Cream dossier used to persist across visits and replace the site.
      // Burn the flag so a recruiter (or you) never lands on paper again.
      localStorage.removeItem(LEGACY_KEY);
      document.documentElement.dataset.ops = "off";
    } catch {
      /* ignore */
    }
  }, []);

  const setRecruiterMode = useCallback((v: boolean) => {
    setRecruiterModeState(v);
    try {
      document.documentElement.dataset.ops = v ? "on" : "off";
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    () => setRecruiterMode(!recruiterMode),
    [recruiterMode, setRecruiterMode]
  );

  const value = useMemo(
    () => ({ recruiterMode, setRecruiterMode, toggle }),
    [recruiterMode, setRecruiterMode, toggle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRecruiterMode() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useRecruiterMode must be used within RecruiterModeProvider");
  }
  return ctx;
}
