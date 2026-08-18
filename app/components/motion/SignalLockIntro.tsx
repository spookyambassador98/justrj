"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../../site.config";

type Props = { onDone: () => void };

const EASE = [0.16, 1, 0.3, 1] as const;
const IMPACT = [0.12, 1.35, 0.28, 1] as const;

type Phase = "void" | "fly" | "hit" | "hold" | "out";

/**
 * Epic vault intro — RJ only.
 * Deep perspective fly-in → impact flash → settle → dissolve.
 * No chromatic ghost outlines (reads cheap on the mark).
 */
export function SignalLockIntro({ onDone }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("void");
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const skip = useCallback(() => {
    if (finished.current) return;
    setPhase("out");
    window.setTimeout(finish, 380);
  }, [finish]);

  useEffect(() => {
    if (reduced) {
      setPhase("hold");
      const a = window.setTimeout(() => setPhase("out"), 600);
      const b = window.setTimeout(finish, 950);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
      };
    }
    const t1 = window.setTimeout(() => setPhase("fly"), 120);
    const t2 = window.setTimeout(() => setPhase("hit"), 1050);
    const t3 = window.setTimeout(() => setPhase("hold"), 1300);
    const t4 = window.setTimeout(() => setPhase("out"), 2100);
    const t5 = window.setTimeout(finish, 2700);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
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

  const out = phase === "out";
  const flying = phase === "fly" || phase === "hit" || phase === "hold";
  const hit = phase === "hit" || phase === "hold";
  const mark = siteConfig.monogram;

  return (
    <motion.div
      className="epic-gate"
      role="presentation"
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: out ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      onClick={skip}
    >
      <div className="epic-gate__void" />

      {/* Impact flash */}
      <motion.div
        className="epic-gate__flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "hit" ? [0, 0.85, 0] : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />

      {/* Shockwave */}
      <motion.div
        className="epic-gate__wave"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={
          hit && !out
            ? { scale: [0.2, 2.4], opacity: [0.6, 0] }
            : { scale: 0.2, opacity: 0 }
        }
        transition={{ duration: 0.9, ease: EASE }}
      />

      <motion.div
        className="epic-gate__bloom"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: out ? 0 : hit ? 0.7 : flying ? 0.2 : 0,
          scale: out ? 1.6 : hit ? 1.2 : 0.7,
        }}
        transition={{ duration: 0.8, ease: EASE }}
      />

      <div className="epic-gate__stage">
        <motion.h1
          className="epic-gate__mark"
          initial={{
            opacity: 0,
            z: -1100,
            scale: 4.5,
            filter: "blur(28px)",
            rotateX: 28,
          }}
          animate={
            out
              ? {
                  opacity: 0,
                  scale: 1.15,
                  filter: "blur(18px)",
                  y: -24,
                  rotateX: 0,
                }
              : hit
                ? {
                    opacity: 1,
                    z: 0,
                    scale: phase === "hold" ? 1.02 : 1,
                    filter: "blur(0px)",
                    rotateX: 0,
                    y: 0,
                  }
                : flying
                  ? {
                      opacity: 1,
                      z: -80,
                      scale: 1.4,
                      filter: "blur(6px)",
                      rotateX: 8,
                    }
                  : {
                      opacity: 0,
                      z: -1100,
                      scale: 4.5,
                    }
          }
          transition={{
            duration: hit ? 0.5 : 1.1,
            ease: hit ? IMPACT : EASE,
          }}
        >
          {mark}
        </motion.h1>
      </div>

      {/* Horizontal light streak on impact */}
      <motion.div
        className="epic-gate__streak"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          phase === "hit"
            ? { scaleX: [0, 1, 1], opacity: [0, 1, 0] }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.55, ease: EASE }}
      />
    </motion.div>
  );
}
