"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerMotion } from "@/lib/motion/register";
import { useViewport } from "../../hooks/useViewport";

export function SmoothScroll() {
  const { reduceMotion, isCoarse } = useViewport();

  useEffect(() => {
    if (reduceMotion || isCoarse) {
      document.documentElement.classList.toggle("rj-reduce", reduceMotion);
      return;
    }

    registerMotion();

    const lenis = new Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [reduceMotion, isCoarse]);

  return null;
}
