"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import BriefForm from "../components/BriefForm";
import LivingBackdrop from "../components/LivingBackdrop";
import { useLang } from "../components/LanguageProvider";
import { PageTransition } from "../components/motion/PageTransition";
import { siteConfig } from "../site.config";

function BriefInner() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const referralCode = (searchParams.get("code") || "").trim();

  const copy = {
    back: "Back",
    eyebrow: "Project inquiry",
    title: "Tell me about the project",
    sub: "For freelance / product builds. Hiring? Email or LinkedIn is faster.",
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-transparent text-white">
        <LivingBackdrop />

        <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
          <Link
            href="/"
            data-cursor="cta"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-white/45 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400/50"
          >
            <ArrowLeft size={14} weight="light" /> {copy.back}
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
            EN
          </span>
        </header>

        <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-4">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/35">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-2xl font-serif text-[clamp(2.4rem,5vw,3.75rem)] italic leading-[1.05] text-white">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/45">
            {copy.sub}
          </p>
          <p className="mt-3 text-[12px] text-cyan-300/50">
            <a
              href={`mailto:${siteConfig.links.email}`}
              className="underline-offset-4 hover:underline"
              data-cursor="cta"
            >
              {siteConfig.links.email}
            </a>
          </p>

          <div className="mt-14 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-[#0a0a0a]/90 p-6 shadow-[0_0_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
            <BriefForm referralCode={referralCode} />
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

export default function BriefPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#020202] text-white/40">
          …
        </div>
      }
    >
      <BriefInner />
    </Suspense>
  );
}
