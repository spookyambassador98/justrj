"use client";

import { useEffect, useRef, useState } from "react";
import {
  EnvelopeSimple,
  LinkedinLogo,
  LockSimple,
} from "@phosphor-icons/react";
import { MagneticButton } from "@/app/components/ui/MagneticButton";
import { siteConfig } from "@/app/site.config";
import type { Lang } from "@/app/components/LanguageProvider";
import { gsap, registerMotion } from "@/lib/motion/register";
import { onIntroReady, isIntroReady } from "@/lib/motion/ready";
import { useViewport } from "@/app/hooks/useViewport";

type HeroSurfaceProps = {
  lang: Lang;
  role: string;
  description: string;
  viewWork: string;
  emailMe: string;
  onNavigate: () => void;
  onNda: () => void;
};

const HEADLINE = {
  en: "Live production demos.",
  ru: "Live production demos.",
  uk: "Live production demos.",
} as const;

export function HeroSurface({
  lang,
  role,
  description,
  viewWork,
  emailMe,
  onNavigate,
  onNda,
}: HeroSurfaceProps) {
  const root = useRef<HTMLElement>(null);
  const { reduceMotion } = useViewport();
  const [lit, setLit] = useState(isIntroReady());
  const given = siteConfig.name.split(" ")[0] ?? "Rauf";
  const family = siteConfig.name.split(" ").slice(1).join(" ");

  useEffect(() => onIntroReady(() => setLit(true)), []);

  useEffect(() => {
    if (!lit || reduceMotion || !root.current) return;
    registerMotion();
    const ctx = gsap.context(() => {
      const stencil = root.current?.querySelector(".hero-stencil");
      const copyNodes = root.current?.querySelectorAll(".hero-copy > *");
      if (!stencil || !copyNodes) return;
      gsap.fromTo(
        stencil,
        { yPercent: 12, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.05, ease: "expoOut" }
      );
      gsap.fromTo(
        copyNodes,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.2, ease: "expoOut" }
      );

      gsap.to(stencil, {
        yPercent: -8,
        scale: 0.86,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [lit, reduceMotion]);

  return (
    <section
      ref={root}
      id="engineering-core"
      className="pointer-events-auto relative flex min-h-[100dvh] w-full flex-col justify-end pb-28 pt-8 sm:pb-32"
    >
      <h1 className="sr-only">
        {siteConfig.name}. {HEADLINE[lang]}
      </h1>
      <div className="stencil-stage pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="stencil-veil absolute inset-0" />
        <div className="absolute inset-x-0 top-[10vh] px-[var(--grid-gutter)] md:top-[6vh]">
          <h1
            className="hero-stencil stencil-mark w-full text-[min(18vw,11.2rem)]"
            aria-hidden
          >
            {given}
          </h1>
        </div>
      </div>

      <div className="hero-copy relative z-10 mt-auto grid w-full grid-cols-12 items-end gap-y-6 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent px-[var(--grid-gutter)] pt-24">
        <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.36em] text-white/40 md:col-span-4">
          <span className="text-white/25">01</span>
          <span className="mx-3 text-white/15">/</span>
          {role}
        </p>

        <div className="col-span-12 md:col-span-8 md:text-right">
          <p className="font-serif text-[clamp(1.6rem,4vw,3.1rem)] italic leading-[1.05] text-white/80">
            {family}
          </p>
          <p className="mt-2 font-display text-[clamp(1.05rem,2.2vw,1.6rem)] uppercase tracking-[0.12em] text-white/45">
            {HEADLINE[lang]}
          </p>
        </div>

        <p className="col-span-12 max-w-xl text-[14px] font-light leading-[1.85] text-white/55 md:col-span-5 md:text-[15px]">
          {description}
        </p>

        <div className="col-span-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:col-span-7 md:justify-end">
          <MagneticButton onClick={onNavigate}>{viewWork}</MagneticButton>
          <MagneticButton href={`mailto:${siteConfig.links.email}`} data-cursor="mail">
            <EnvelopeSimple size={16} weight="light" />
            {emailMe}
          </MagneticButton>
          <button
            type="button"
            onClick={onNda}
            data-cursor="cta"
            aria-label={siteConfig.source.label[lang]}
            className="filament filament--ghost"
          >
            <LockSimple size={16} weight="light" />
            {siteConfig.source.label[lang]}
          </button>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            data-cursor="cta"
            aria-label="LinkedIn"
            className="filament filament--ghost"
          >
            <LinkedinLogo size={18} weight="light" />
          </a>
        </div>
      </div>
    </section>
  );
}
