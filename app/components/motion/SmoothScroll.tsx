"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useViewport } from "../../hooks/useViewport";

export function SmoothScroll() {
  const { reduceMotion, isCoarse } = useViewport();

  useEffect(() => {
    if (reduceMotion || isCoarse) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduceMotion, isCoarse]);

  return null;
}
