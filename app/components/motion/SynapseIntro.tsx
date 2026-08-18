"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../../site.config";

type Props = {
  onDone: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const SNAP = [0.34, 1.56, 0.64, 1] as const;

type Phase = "void" | "mark" | "cut" | "hold" | "exit";

/**
 * Mandatory gate — always plays before the neural field.
 * Void → RJ collision → slash/flash → peel into NeuralCanvas.
 * Reduced motion: shorter but still present. Esc / click skips.
 */
export function SynapseIntro({ onDone }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("void");
  const finished = useRef(false);
  const word = siteConfig.introWord;
  const letters = word.split("");

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const skip = useCallback(() => {
    if (finished.current) return;
    setPhase("exit");
    window.setTimeout(() => finish(), 320);
  }, [finish]);

  useEffect(() => {
    if (reduced) {
      setPhase("mark");
      const hold = window.setTimeout(() => setPhase("exit"), 700);
      const done = window.setTimeout(finish, 1100);
      return () => {
        clearTimeout(hold);
        clearTimeout(done);
      };
    }

    const t1 = window.setTimeout(() => setPhase("mark"), 200);
    const t2 = window.setTimeout(() => setPhase("cut"), 1150);
    const t3 = window.setTimeout(() => setPhase("hold"), 1500);
    const t4 = window.setTimeout(() => setPhase("exit"), 2000);
    const done = window.setTimeout(finish, 2700);

    return () => {
      [t1, t2, t3, t4, done].forEach(clearTimeout);
    };
  }, [finish, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const exiting = phase === "exit";

  return (
    <motion.div
      className="rj-gate"
      role="dialog"
      aria-label="Portfolio boot sequence"
      aria-modal="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.55, ease: EASE, delay: exiting ? 0.12 : 0 }}
      onClick={skip}
    >
      <div className="rj-gate__void" />

      <motion.div
        className="rj-gate__bloom"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: exiting ? 0 : phase === "void" ? 0.2 : 0.6,
          scale: exiting ? 1.4 : phase === "cut" || phase === "hold" ? 1.18 : 1,
        }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <div className="rj-gate__grain" />
      <div className="rj-gate__vignette" />

      <motion.div
        className="rj-gate__flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "cut" ? [0, 0.6, 0] : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />

      <div className="rj-gate__stage">
        <motion.p
          className="rj-gate__meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: exiting || phase === "void" ? 0 : 0.7,
            y: phase === "void" ? 12 : 0,
          }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
        >
          EST. SYSTEMS
        </motion.p>

        <h1 className="rj-gate__word" aria-label={word}>
          {letters.map((ch, i) => {
            const fromLeft = i === 0;
            return (
              <span key={`${ch}-${i}`} className="rj-gate__slot">
                <motion.span
                  className="rj-gate__letter"
                  initial={{
                    opacity: 0,
                    x: fromLeft ? "-45vw" : "45vw",
                    y: fromLeft ? "8vh" : "-8vh",
                    rotate: fromLeft ? -12 : 12,
                    filter: "blur(24px)",
                    scale: 1.35,
                  }}
                  animate={
                    exiting
                      ? {
                          opacity: 0,
                          scale: 1.25,
                          filter: "blur(20px)",
                          y: fromLeft ? "-12vh" : "12vh",
                        }
                      : phase === "void"
                        ? {
                            opacity: 0,
                            x: fromLeft ? "-45vw" : "45vw",
                          }
                        : {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            rotate: 0,
                            filter: "blur(0px)",
                            scale: phase === "hold" || phase === "cut" ? 1.02 : 1,
                          }
                  }
                  transition={{
                    duration: exiting ? 0.45 : reduced ? 0.45 : 0.95,
                    delay: exiting ? i * 0.04 : 0.05 + i * 0.08,
                    ease: exiting ? EASE : SNAP,
                  }}
                >
                  <span className="rj-gate__ghost rj-gate__ghost--c" aria-hidden>
                    {ch}
                  </span>
                  <span className="rj-gate__ghost rj-gate__ghost--m" aria-hidden>
                    {ch}
                  </span>
                  <span className="rj-gate__solid">{ch}</span>
                </motion.span>
              </span>
            );
          })}
        </h1>

        <motion.div
          className="rj-gate__slash"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            phase === "cut" || phase === "hold"
              ? { scaleX: 1, opacity: exiting ? 0 : 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.4, ease: EASE }}
        />

        <motion.p
          className="rj-gate__sub"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{
            opacity: exiting || phase === "void" || phase === "mark" ? 0 : 0.55,
            letterSpacing: "0.32em",
          }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
        >
          {siteConfig.introKicker}
        </motion.p>
      </div>

      <motion.p
        className="rj-gate__hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 0.35 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      >
        ESC / CLICK TO SKIP
      </motion.p>
    </motion.div>
  );
}
