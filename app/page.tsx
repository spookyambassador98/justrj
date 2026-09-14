"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLang } from "./components/LanguageProvider";
import { useRecruiterMode } from "./components/RecruiterMode";
import { siteConfig } from "./site.config";
import { MagneticButton } from "./components/ui/MagneticButton";
import { PremiumLoader } from "./components/ui/PremiumLoader";
import { RecruiterBrief } from "./components/ui/RecruiterBrief";
import { NdaRequestOverlay } from "./components/NdaRequestOverlay";
import { PageTransition } from "./components/motion/PageTransition";
import { HeroSurface } from "./components/hero/HeroSurface";
import { ProductionHUD } from "./components/production/ProductionHUD";

const NeuralCanvas = dynamic(
  () => import("./components/three/NeuralCanvas").then((m) => m.NeuralCanvas),
  { ssr: false }
);

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const { lang } = useLang();
  const { recruiterMode } = useRecruiterMode();
  const [isRouting, setIsRouting] = useState(false);
  const [ndaOpen, setNdaOpen] = useState(false);
  const router = useRouter();

  const handleNavigateToProjects = () => {
    if (isRouting) return;
    setIsRouting(true);
    setTimeout(() => router.push("/projects"), 900);
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
        "Remote US W2/contract. Six live production demos. Strongest in Cursor/Claude-assisted 0→1 delivery.",
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
        "Remote US W2/contract. Шесть live production demos. Сильнее всего в 0→1 с Cursor/Claude.",
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
        "Remote US W2/contract. Шість live production demos. Найсильніше в 0→1 з Cursor/Claude.",
      finalCta: "Почати розмову",
      footer: `© ${new Date().getFullYear()} ${siteConfig.name} · ${siteConfig.monogram}`,
    },
  } as const;

  const t = copy[lang];

  return (
    <PageTransition>
      <PremiumLoader
        active={isRouting}
        text={
          lang === "ru" ? "Загрузка" : lang === "uk" ? "Завантаження" : "Loading"
        }
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative min-h-screen w-full bg-[#020202] font-sans text-white selection:bg-cyan-400/20"
      >
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 95% 80% at 52% 38%, rgba(12, 28, 62, 0.05) 0%, rgba(8, 18, 42, 0.035) 28%, rgba(2, 6, 14, 0.02) 55%, transparent 72%)",
          }}
        />

        {!recruiterMode && (
          <NeuralCanvas active />
        )}

        <div className="pointer-events-auto absolute left-4 top-4 z-20 flex items-center gap-3 safe-pad-t sm:left-8 sm:top-6">
          <span
            className="font-display text-[11px] font-semibold tracking-[0.28em] text-white/45"
            aria-label={`${siteConfig.monogram} mark`}
          >
            {siteConfig.monogram}
          </span>
        </div>

        {/* Language locked to EN for RJ portfolio */}

        {recruiterMode && (
          <RecruiterBrief lang={lang} onNavigate={handleNavigateToProjects} />
        )}

        {!recruiterMode && (
          <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[90rem] flex-col justify-between px-4 pb-28 pt-24 safe-pad-x sm:px-6 sm:pb-32 sm:pt-28 md:px-10 lg:px-16">
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

            <ProductionHUD
              lang={lang}
              onNavigate={handleNavigateToProjects}
            />

            <section className="pointer-events-auto mt-24 w-full md:mt-40">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/35">
                  {t.stackTitle}
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {siteConfig.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/55 backdrop-blur-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </section>

            <section className="pointer-events-auto mt-24 w-full text-center md:mt-40">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                viewport={{ once: true }}
                className="relative rounded-[1.75rem] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-[#020202]/70 p-8 shadow-[0_0_80px_rgba(0,0,0,0.4)] backdrop-blur-3xl sm:rounded-[2.5rem] sm:p-12 md:rounded-[3rem] md:p-16"
              >
                <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-cyan-400/[0.03] via-transparent to-transparent" />
                <h2 className="relative mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-2xl font-light text-transparent sm:text-3xl md:text-5xl">
                  {t.finalTitle}
                </h2>
                <p className="relative mx-auto mb-8 max-w-2xl text-sm font-light text-white/45 sm:mb-10 sm:text-base md:text-lg">
                  {t.finalSub}
                </p>
                <div className="relative flex items-center justify-center">
                  <MagneticButton href={`mailto:${siteConfig.links.email}`}>
                    {t.finalCta}
                  </MagneticButton>
                </div>
              </motion.div>
            </section>

            <footer className="pointer-events-auto mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pb-6 pt-8 text-[10px] uppercase tracking-[0.2em] text-white/30 backdrop-blur-md safe-pad-b sm:mt-24 md:mt-32 md:flex-row md:gap-0">
              <p>{t.footer}</p>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="transition-colors hover:text-white/70"
                data-cursor="cta"
              >
                {siteConfig.links.email}
              </a>
            </footer>
          </div>
        )}

        <NdaRequestOverlay
          open={ndaOpen}
          onClose={() => setNdaOpen(false)}
          lang={lang}
        />
      </motion.main>
    </PageTransition>
  );
}
