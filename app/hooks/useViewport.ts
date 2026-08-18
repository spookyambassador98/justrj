"use client";

import { useEffect, useState } from "react";

export type ViewportProfile = {
  ready: boolean;
  /** phone / small tablet portrait */
  isMobile: boolean;
  /** touch-first device */
  isCoarse: boolean;
  /** user prefers less motion */
  reduceMotion: boolean;
  /** use lighter 3D / effects */
  lite: boolean;
};

const initial: ViewportProfile = {
  ready: false,
  isMobile: false,
  isCoarse: false,
  reduceMotion: false,
  lite: false,
};

export function useViewport(): ViewportProfile {
  const [profile, setProfile] = useState<ViewportProfile>(initial);

  useEffect(() => {
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const coarseMq = window.matchMedia("(pointer: coarse)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const isMobile = mobileMq.matches;
      const isCoarse = coarseMq.matches;
      const reduceMotion = motionMq.matches;
      setProfile({
        ready: true,
        isMobile,
        isCoarse,
        reduceMotion,
        lite: isMobile || isCoarse || reduceMotion,
      });
    };

    apply();
    mobileMq.addEventListener("change", apply);
    coarseMq.addEventListener("change", apply);
    motionMq.addEventListener("change", apply);
    return () => {
      mobileMq.removeEventListener("change", apply);
      coarseMq.removeEventListener("change", apply);
      motionMq.removeEventListener("change", apply);
    };
  }, []);

  return profile;
}
