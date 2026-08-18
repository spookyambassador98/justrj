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
const STORAGE_KEY = "rj-recruiter-mode";

export function RecruiterModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recruiterMode, setRecruiterModeState] = useState(false);

  useEffect(() => {
    try {
      // Only restore ON if explicitly saved — never surprise-black the neural field
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setRecruiterModeState(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setRecruiterMode = useCallback((v: boolean) => {
    setRecruiterModeState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
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
