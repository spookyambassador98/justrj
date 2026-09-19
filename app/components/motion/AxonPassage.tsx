"use client";

import { useEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion/register";
import { useViewport } from "../../hooks/useViewport";
import { L, resolveShot, projectsData, type Project } from "../../projects/data";
import { FEATURED_IDS } from "../production/featured";
import type { Lang } from "../LanguageProvider";

export function AxonPassage({
  lang,
  onInspect,
}: {
  lang: Lang;
  onInspect: () => void;
}) {
  const pin = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { reduceMotion, isMobile } = useViewport();

  const featured = FEATURED_IDS.map((id) =>
    projectsData.find((p) => p.id === id)
  ).filter(Boolean) as Project[];

  useEffect(() => {
    if (reduceMotion || isMobile || !pin.current || !track.current) return;
    registerMotion();
    const ctx = gsap.context(() => {
      const el = track.current;
      const section = pin.current;
      if (!el || !section) return;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 80);
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });
    }, pin);
    return () => ctx.revert();
  }, [reduceMotion, isMobile]);

  return (
    <section
      ref={pin}
      className="axon pointer-events-auto relative z-10 py-16 md:py-0"
      aria-label="Live systems"
    >
      <div className="flex items-end justify-between px-[var(--grid-gutter)] pb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
            02 / axon
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.2rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
            Live current
          </h2>
        </div>
        <p className="hidden max-w-xs text-right font-mono text-[9px] leading-relaxed tracking-[0.16em] text-white/30 md:block">
          Seven production demos. Drag is scroll. Open the HUD to inspect evidence.
        </p>
      </div>

      <div className="overflow-hidden px-[var(--grid-gutter)]">
        <div
          ref={track}
          className="axon__track pb-8 md:w-max md:pb-16"
          style={{ display: isMobile ? "flex" : undefined }}
        >
          {featured.map((p, i) => (
            <article key={p.id} className="axon__station">
              <button
                type="button"
                onClick={onInspect}
                data-cursor="project"
                className="block w-full text-left"
              >
                <div className="axon__shot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveShot(p.image, lang)}
                    alt={L(p.title, lang)}
                    draggable={false}
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[color:var(--filament)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 font-display text-xl font-bold uppercase tracking-[-0.03em] text-white md:text-2xl">
                    {L(p.title, lang)}
                  </h3>
                  <span className="font-mono text-[10px] text-white/30">{p.year}</span>
                </div>
                <p className="mt-2 max-w-[36ch] text-[13px] font-light leading-relaxed text-white/45">
                  {L(p.hook, lang)}
                </p>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
