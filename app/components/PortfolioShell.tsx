"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SignalLockIntro } from "./motion/SignalLockIntro";
import { CustomCursor } from "./motion/CustomCursor";
import { SmoothScroll } from "./motion/SmoothScroll";
import { RecruiterModeProvider, useRecruiterMode } from "./RecruiterMode";
import { HireStrip } from "./ui/HireStrip";
import { useLang } from "./LanguageProvider";

type Phase = "intro" | "app";

function ShellInner({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const { recruiterMode } = useRecruiterMode();
  const { lang } = useLang();

  const onIntroDone = useCallback(() => setPhase("app"), []);

  return (
    <>
      {!recruiterMode && <SmoothScroll />}
      {!recruiterMode && phase === "app" && <CustomCursor />}

      {/* Site mounts under the gate so iris can reveal the neural field */}
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
