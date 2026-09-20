"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useLang } from "./components/LanguageProvider";
import { useRecruiterMode } from "./components/RecruiterMode";
import { siteConfig } from "./site.config";
import { MagneticButton } from "./components/ui/MagneticButton";
import { RecruiterBrief } from "./components/ui/RecruiterBrief";
import { NdaRequestOverlay } from "./components/NdaRequestOverlay";
import { PageTransition } from "./components/motion/PageTransition";
import { HeroSurface } from "./components/hero/HeroSurface";
import { ProductionHUD } from "./components/production/ProductionHUD";
import { AxonPassage } from "./components/motion/AxonPassage";
import { CurrentMarquee } from "./components/motion/CurrentMarquee";
import { FooterMark } from "./components/motion/FooterMark";
import { requestProjectPage } from "@/lib/motion/curtain";

const NeuralCanvas = dynamic(
  () => import("./components/three/NeuralCanvas").then((m) => m.NeuralCanvas),
  { ssr: false }
);

export default function Home() {
  const { lang } = useLang();
  const { recruiterMode } = useRecruiterMode();
  const [ndaOpen, setNdaOpen] = useState(false);

  const handleNavigateToProjects = (projectId?: string) => {
    requestProjectPage(projectId);
  };

  const copy = {
    en: {
      role: siteConfig.role.en,
      description: siteConfig.tagline.en,
      viewWork: "Open production HUD",
      emailMe: "Email me",
      stackTitle: "Stack I ship with",
      finalTitle: "Open to AI-native product & full-stack builder roles",
      finalSub:
        "Remote US W2/contract. Live production demos on the public levels. Other systems are walked in the interview. Strongest in Cursor/Claude-assisted 0→1 delivery.",
      finalCta: "Start a conversation",
      footer: `© ${new Date().getFullYear()} ${siteConfig.name} · ${siteConfig.monogram}`,
    },
    ru: {
      role: siteConfig.role.ru,
      description: siteConfig.tagline.ru,
      viewWork: "Production HUD",
      emailMe: "Написать",
      stackTitle: "Стек, с которым шиплю",
      finalTitle: "Открыт к AI-native product и full-stack builder ролям",
      finalSub:
        "Remote US W2/contract. Live production demos на публичных уровнях. Остальное разбираем на интервью. Сильнее всего в 0→1 с Cursor/Claude.",
      finalCta: "Начать разговор",
      footer: `© ${new Date().getFullYear()} ${siteConfig.name} · ${siteConfig.monogram}`,
    },
    uk: {
      role: siteConfig.role.uk,
      description: siteConfig.tagline.uk,
      viewWork: "Production HUD",
      emailMe: "Написати",
      stackTitle: "Стек, з яким шиплю",
      finalTitle: "Відкритий до AI-native product і full-stack builder ролей",
      finalSub:
        "Remote US W2/contract. Live production demos на публічних рівнях. Решту розбираємо на інтерв’ю. Найсильніше в 0→1 з Cursor/Claude.",
      finalCta: "Почати розмову",
      footer: `© ${new Date().getFullYear()} ${siteConfig.name} · ${siteConfig.monogram}`,
    },
  } as const;

  const t = copy[lang];

  return (
    <PageTransition>
      <main className="relative min-h-screen w-full bg-transparent font-sans text-[var(--ink)] selection:bg-[color:var(--filament)]/20">
        {!recruiterMode && <NeuralCanvas active />}

        {!recruiterMode && (
          <div className="pointer-events-auto absolute left-[var(--grid-gutter)] top-5 z-20 flex items-center gap-3 safe-pad-t">
            <span
              className="font-mono text-[10px] tracking-[0.32em] text-white/40"
              aria-label={`${siteConfig.monogram} mark`}
            >
              {siteConfig.monogram} · CONDUCTION
            </span>
          </div>
        )}

        {recruiterMode && (
          <RecruiterBrief
            lang={lang}
            onNavigate={handleNavigateToProjects}
            onHoldNda={() => setNdaOpen(true)}
          />
        )}

        {!recruiterMode && (
          <div className="relative z-10">
            <HeroSurface
              lang={lang}
              role={t.role}
              description={t.description}
              viewWork={t.viewWork}
              emailMe={t.emailMe}
              onNavigate={() =>
                document
                  .getElementById("production")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              onNda={() => setNdaOpen(true)}
            />

            <AxonPassage lang={lang} onInspect={handleNavigateToProjects} />

            <div className="px-[var(--grid-gutter)]">
              <ProductionHUD
                lang={lang}
                onNavigate={handleNavigateToProjects}
                onHoldNda={() => setNdaOpen(true)}
              />
            </div>

            <CurrentMarquee title={t.stackTitle} />

            <section className="pointer-events-auto px-[var(--grid-gutter)] pb-8">
              <div className="border-t border-white/[0.08] py-16 md:py-24">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                  04 / terminal
                </p>
                <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,6vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-white">
                  {t.finalTitle}
                </h2>
                <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-white/50 md:text-base">
                  {t.finalSub}
                </p>
                <div className="mt-10">
                  <MagneticButton href={`mailto:${siteConfig.links.email}`} data-cursor="mail">
                    {t.finalCta}
                  </MagneticButton>
                </div>
              </div>
            </section>

            <footer className="pointer-events-auto px-[var(--grid-gutter)] pb-28">
              <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 md:flex-row">
                <p>{t.footer}</p>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="transition-colors hover:text-white/70"
                  data-cursor="mail"
                >
                  {siteConfig.links.email}
                </a>
              </div>
              <FooterMark />
            </footer>
          </div>
        )}

        <NdaRequestOverlay
          open={ndaOpen}
          onClose={() => setNdaOpen(false)}
          lang={lang}
        />
      </main>
    </PageTransition>
  );
}
