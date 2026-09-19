"use client";

import { useEffect } from "react";

export function ScrollProgress() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".scroll-progress");
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      el.style.setProperty("--sp", String(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="scroll-progress" aria-hidden />;
}
