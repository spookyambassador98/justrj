"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SignalLockIntro } from "./motion/SignalLockIntro";
import { InstrumentCursor } from "./motion/InstrumentCursor";
import { SmoothScroll } from "./motion/SmoothScroll";
import { LiquidCurtain } from "./motion/LiquidCurtain";
import { ScrollProgress } from "./motion/ScrollProgress";
import { RecruiterModeProvider, useRecruiterMode } from "./RecruiterMode";
import { HireStrip } from "./ui/HireStrip";
import { SilentTracker } from "./SilentTracker";
import { useLang } from "./LanguageProvider";
import { markIntroReady } from "@/lib/motion/ready";

type Phase = "intro" | "app";

function ShellInner({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const { recruiterMode } = useRecruiterMode();
  const { lang } = useLang();

  const onIntroDone = useCallback(() => {
    markIntroReady();
    setPhase("app");
    if (typeof document !== "undefined") {
      document.documentElement.dataset.ops = recruiterMode ? "on" : "off";
    }
  }, [recruiterMode]);

  return (
    <>
      {!recruiterMode && <SmoothScroll />}
      {!recruiterMode && phase === "app" && <InstrumentCursor />}
      <LiquidCurtain />
      <ScrollProgress />
      <div className="site-grain" aria-hidden />

      <div
        aria-hidden={phase === "intro"}
        style={{
          pointerEvents: phase === "intro" ? "none" : "auto",
        }}
      >
        {children}
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <SignalLockIntro key="intro" onDone={onIntroDone} />
        )}
      </AnimatePresence>

      {phase === "app" && <HireStrip lang={lang} />}
      <SilentTracker />
    </>
  );
}

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  return (
    <RecruiterModeProvider>
      <ShellInner>{children}</ShellInner>
    </RecruiterModeProvider>
  );
}
