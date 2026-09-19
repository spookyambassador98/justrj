"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useViewport } from "../../hooks/useViewport";

type CursorMode = "default" | "cta" | "project" | "drag";

export function CustomCursor() {
  const { isCoarse, reduceMotion } = useViewport();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 28, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 380, damping: 28, mass: 0.35 });

  useEffect(() => {
    if (isCoarse || reduceMotion) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const hit = (e.target as HTMLElement | null)?.closest("[data-cursor]");
      const next = ((hit as HTMLElement | null)?.dataset.cursor as CursorMode) || "default";
      setMode(next);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [isCoarse, reduceMotion, x, y]);

  if (isCoarse || reduceMotion) return null;

  const scale = mode === "cta" ? 2.2 : mode === "project" ? 1.8 : mode === "drag" ? 1.4 : 1;

  return (
    <motion.div
      className="custom-cursor"
      aria-hidden
      style={{
        x: sx,
        y: sy,
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        className={`custom-cursor__dot custom-cursor__dot--${mode}`}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      />
    </motion.div>
  );
}
