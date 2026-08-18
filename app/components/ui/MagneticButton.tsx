"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useViewport } from "../../hooks/useViewport";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
  "data-cursor"?: string;
};

const baseClass =
  "relative inline-flex w-full max-w-[20rem] items-center justify-center overflow-hidden rounded-full border border-white/[0.12] bg-[#0a0a0a]/50 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(96,165,250,0.12)] backdrop-blur-2xl transition-[border-color,box-shadow,background] duration-500 will-change-transform hover:border-cyan-400/30 hover:bg-white/[0.03] hover:shadow-[0_0_60px_rgba(56,189,248,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400/60 active:scale-[0.98] sm:w-auto sm:px-12 sm:py-5 sm:text-sm sm:tracking-[0.2em]";

export function MagneticButton({
  children,
  onClick,
  className = "",
  href,
  type = "button",
  "aria-label": ariaLabel,
  "data-cursor": dataCursor = "cta",
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const { isCoarse } = useViewport();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    if (isCoarse || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.3);
    y.set((clientY - (top + height / 2)) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-md">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ x: springX, y: springY }}
        className={`group ${baseClass} ${className}`}
        aria-label={ariaLabel}
        data-cursor={dataCursor}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`group ${baseClass} ${className}`}
      aria-label={ariaLabel}
      data-cursor={dataCursor}
    >
      {inner}
    </motion.button>
  );
}
