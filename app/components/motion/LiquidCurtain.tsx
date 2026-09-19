"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap, registerMotion } from "@/lib/motion/register";
import { subscribeCurtain } from "@/lib/motion/curtain";

const COVER = "M0 0 H1 V1 Q0.5 1.22 0 1 Z";
const FLAT = "M0 0 H1 V0 Q0.5 0 0 0 Z";
const HOLD = "M0 0 H1 V1 Q0.5 1 0 1 Z";

export function LiquidCurtain() {
  const router = useRouter();
  const pathRef = useRef<SVGPathElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    registerMotion();
    return subscribeCurtain((href) => {
      const path = pathRef.current;
      const root = wrap.current;
      if (!path || !root) {
        router.push(href);
        return;
      }
      setBusy(true);
      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href);
          gsap.to(path, {
            attr: { d: FLAT },
            duration: 0.55,
            ease: "current",
            delay: 0.12,
            onComplete: () => setBusy(false),
          });
        },
      });
      gsap.set(path, { attr: { d: FLAT } });
      tl.to(path, { attr: { d: COVER }, duration: 0.55, ease: "current" }).to(
        path,
        { attr: { d: HOLD }, duration: 0.12 }
      );
    });
  }, [router]);

  return (
    <div
      ref={wrap}
      className="curtain"
      aria-hidden
      style={{ pointerEvents: busy ? "auto" : "none" }}
    >
      <svg viewBox="0 0 1 1" preserveAspectRatio="none">
        <path ref={pathRef} d={FLAT} fill="#05070c" />
      </svg>
    </div>
  );
}
