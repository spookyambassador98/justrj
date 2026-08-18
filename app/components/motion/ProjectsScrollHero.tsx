"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useViewport } from "../../hooks/useViewport";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  eyebrow: string;
  title: string;
  sub: string;
};

export function ProjectsScrollHero({ eyebrow, title, sub }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useViewport();

  useGSAP(
    () => {
      if (reduceMotion || !root.current) return;

      const letters = root.current.querySelectorAll(".ps-hero__letter");
      gsap.fromTo(
        letters,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          stagger: 0.028,
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "top 35%",
            scrub: 0.65,
          },
        }
      );

      gsap.fromTo(
        root.current.querySelector(".ps-hero__sub"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "top 40%",
            scrub: true,
          },
        }
      );
    },
    { scope: root, dependencies: [reduceMotion, title, sub] }
  );

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const chars = title.split("");

  return (
    <div ref={root} className="ps-hero relative mb-16 md:mb-24">
      <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-cyan-300/55">
        {eyebrow}
      </p>
      <h1
        className="font-display text-[clamp(2.4rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white"
        aria-label={title}
      >
        {chars.map((ch, i) => (
          <span key={`${ch}-${i}`} className="inline-block overflow-hidden align-bottom">
            <span className="ps-hero__letter inline-block will-change-transform">
              {ch === " " ? "\u00A0" : ch}
            </span>
          </span>
        ))}
      </h1>
      <p className="ps-hero__sub mt-6 max-w-2xl text-sm font-light leading-relaxed text-white/50 sm:text-base">
        {sub}
      </p>
    </div>
  );
}
