"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "../../site.config";
import { useViewport } from "../../hooks/useViewport";

export function CurrentMarquee({ title }: { title: string }) {
  const row = useRef<HTMLDivElement>(null);
  const vel = useRef(0);
  const last = useRef(0);
  const { reduceMotion } = useViewport();

  useEffect(() => {
    if (reduceMotion) return;
    let offset = 0;
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      vel.current = Math.max(-40, Math.min(40, y - last.current));
      last.current = y;
    };
    const tick = () => {
      offset += 0.6 + vel.current * 0.12;
      vel.current *= 0.92;
      if (row.current) {
        const skew = vel.current * 0.35;
        row.current.style.transform = `translate3d(${-offset}px,0,0) skewX(${skew}deg)`;
        const w = row.current.scrollWidth / 2;
        if (offset > w) offset -= w;
        if (offset < 0) offset += w;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  const items = [...siteConfig.stack, ...siteConfig.stack];

  return (
    <section className="pointer-events-none relative z-10 overflow-hidden py-16 md:py-24">
      <p className="mb-6 px-[var(--grid-gutter)] font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
        03 / {title}
      </p>
      <div className="border-y border-white/[0.08] py-5">
        <div ref={row} className="flex w-max gap-10 will-change-transform">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold uppercase tracking-[-0.04em] text-white/80"
            >
              {item}
              <span className="ml-10 text-[color:var(--filament)]">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
