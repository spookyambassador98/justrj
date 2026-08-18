"use client";

import { motion } from "framer-motion";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  LockSimple,
} from "@phosphor-icons/react";
import { MagneticButton } from "@/app/components/ui/MagneticButton";
import { siteConfig } from "@/app/site.config";
import type { Lang } from "@/app/components/LanguageProvider";
import {
  clipReveal,
  fadeRise,
  letterPull,
  staggerContainer,
  staggerFast,
} from "@/lib/motion";

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
  en: ["Structural", "perfection."],
  ru: ["Структурное", "совершенство."],
  uk: ["Структурна", "досконалість."],
} as const;

/**
 * Engineering Core hero — brand-first, liquid stagger, clinical framing.
 */
export function HeroSurface({
  lang,
  role,
  description,
  viewWork,
  emailMe,
  onNavigate,
  onNda,
}: HeroSurfaceProps) {
  const nameParts = siteConfig.name.split(" ");
  const words = HEADLINE[lang];

  return (
    <section
      id="engineering-core"
      className="pointer-events-auto relative flex min-h-[72vh] w-full max-w-7xl flex-col items-start justify-center pb-16 pt-10 sm:pb-24 sm:pt-16 md:min-h-[78vh] md:pb-28 md:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-4 top-4 bottom-0 right-0 z-0 md:-left-10 md:right-[10%] lg:right-[22%]"
        style={{
          background: `
            linear-gradient(90deg, rgba(2,2,2,0.92) 0%, rgba(2,2,2,0.75) 40%, rgba(2,2,2,0.28) 72%, transparent 100%),
            linear-gradient(180deg, rgba(2,2,2,0.5) 0%, rgba(2,2,2,0.2) 70%, transparent 100%)
          `,
        }}
      />

      {/* Clinical corner marks */}
      <div className="pointer-events-none absolute left-0 top-8 hidden h-10 w-10 border-l border-t border-white/20 md:block" />
      <div className="pointer-events-none absolute bottom-8 left-0 hidden h-10 w-10 border-b border-l border-white/20 md:block" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 w-full"
      >
        <motion.p
          variants={fadeRise}
          className="mb-5 font-mono text-[10px] uppercase tracking-[0.38em] text-white/40 sm:mb-6"
        >
          {role}
        </motion.p>

        <motion.div
          variants={fadeRise}
          className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] text-white/55"
        >
          <span className="inline-flex size-7 items-center justify-center border border-white/25 text-[11px] text-white">
            {siteConfig.monogram}
          </span>
          <span>ENGINEERING CORE</span>
        </motion.div>

        <h1 className="relative w-full max-w-[min(96vw,72rem)]">
          <span className="sr-only">
            {siteConfig.name}. {words.join(" ")}
          </span>
          <motion.span
            variants={staggerFast}
            className="flex flex-wrap gap-x-[0.22em] gap-y-1 font-display text-[clamp(2.5rem,8.8vw,6.4rem)] font-medium leading-[0.95] tracking-[-0.035em]"
            aria-hidden
          >
            {nameParts.map((word) => (
              <span key={word} className="inline-block overflow-hidden pb-[0.1em]">
                <motion.span variants={letterPull} className="inline-block text-white">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <motion.h2
          variants={staggerFast}
          className="mt-5 flex flex-wrap gap-x-3 font-display text-[clamp(1.35rem,3.5vw,2.35rem)] font-medium tracking-[-0.02em] text-white/55"
          aria-hidden
        >
          {words.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden">
              <motion.span
                variants={letterPull}
                className={`inline-block ${i === 1 ? "text-white/90" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.p
          variants={clipReveal}
          className="mt-8 max-w-xl text-[14px] font-light leading-[1.85] text-white/60 sm:mt-10 sm:text-[15px] md:max-w-2xl md:text-base"
        >
          {description}
        </motion.p>

        <motion.div
          variants={fadeRise}
          className="mt-10 flex w-full flex-col gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <MagneticButton onClick={onNavigate}>{viewWork}</MagneticButton>
          <MagneticButton
            href={`mailto:${siteConfig.links.email}`}
            className="border-white/[0.08] bg-transparent shadow-none"
          >
            <EnvelopeSimple size={16} weight="light" />
            {emailMe}
          </MagneticButton>
        </motion.div>

        <motion.div
          variants={fadeRise}
          className="mt-8 flex flex-wrap items-center gap-4 text-white/35"
        >
          <button
            type="button"
            onClick={onNda}
            data-cursor="cta"
            aria-label={siteConfig.source.label[lang]}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <LockSimple size={20} weight="light" />
            <span className="text-[10px] uppercase tracking-[0.18em]">
              {siteConfig.source.label[lang]}
            </span>
          </button>
          {siteConfig.links.github ? (
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="cta"
              aria-label="GitHub"
              className="transition-colors hover:text-white"
            >
              <GithubLogo size={20} weight="light" />
            </a>
          ) : null}
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            data-cursor="cta"
            aria-label="LinkedIn"
            className="transition-colors hover:text-white"
          >
            <LinkedinLogo size={20} weight="light" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
