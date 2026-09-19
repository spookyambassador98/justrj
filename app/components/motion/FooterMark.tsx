"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion/register";
import { useViewport } from "../../hooks/useViewport";
import { siteConfig } from "../../site.config";

export function FooterMark() {
  const root = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useViewport();

  useEffect(() => {
    if (reduceMotion || !root.current) return;
    registerMotion();
    const letters = root.current.querySelectorAll(".foot-letter");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: root.current,
            start: "top 90%",
            end: "top 45%",
            scrub: 0.5,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);

  const mark = siteConfig.monogram.split("");

  return (
    <div ref={root} className="overflow-hidden pt-10" aria-hidden>
      <p className="foot-mark flex justify-center">
        {mark.map((ch, i) => (
          <span key={`${ch}-${i}`} className="inline-block overflow-hidden">
            <span className="foot-letter inline-block will-change-transform">{ch}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
