"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, registerMotion } from "@/lib/motion/register";
import { markIntroReady } from "@/lib/motion/ready";
import { siteConfig } from "../../site.config";
import { useViewport } from "../../hooks/useViewport";

type Props = { onDone: () => void };

const SESSION_KEY = "rj-conduction-seen";

export function ConductionIntro({ onDone }: Props) {
  const { reduceMotion } = useViewport();
  const root = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const finished = useRef(false);
  const [show, setShow] = useState(true);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    markIntroReady();
    onDone();
    setShow(false);
  }, [onDone]);

  useEffect(() => {
    registerMotion();

    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        finish();
        return;
      }
    } catch {
      /* ignore */
    }

    if (reduceMotion) {
      const t = window.setTimeout(finish, 80);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      const fiber = pathRef.current;
      const count = countRef.current;
      const mark = root.current?.querySelector(".cond__mark");
      const hint = root.current?.querySelector(".cond__hint");
      const gate = root.current;
      if (!fiber || !count || !mark || !hint || !gate) return;

      const len = fiber.getTotalLength();
      gsap.set(fiber, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(mark, { yPercent: 24, opacity: 0, filter: "blur(16px)" });
      gsap.set(hint, { opacity: 0 });

      const counter = { n: 0 };
      const tl = gsap.timeline({ onComplete: finish, defaults: { ease: "expoOut" } });

      tl.to(fiber, { strokeDashoffset: 0, duration: 0.65 })
        .to(
          counter,
          {
            n: 100,
            duration: 0.65,
            ease: "none",
            onUpdate: () => {
              count.textContent = String(Math.round(counter.n)).padStart(3, "0");
            },
          },
          0
        )
        .to(mark, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.5 }, 0.28)
        .to(hint, { opacity: 1, duration: 0.25 }, 0.4)
        .to(gate, { yPercent: -108, duration: 0.55, ease: "current" }, "+=0.15");
    }, root);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    const cap = window.setTimeout(finish, 2000);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      clearTimeout(cap);
    };
  }, [finish, reduceMotion]);

  if (!show) return null;

  return (
    <div
      ref={root}
      className="cond"
      role="presentation"
      aria-hidden
      onClick={finish}
    >
      <span ref={countRef} className="cond__count">
        000
      </span>
      <svg className="cond__fiber" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d="M -5 62 C 18 40, 28 78, 48 52 S 78 28, 105 44"
          fill="none"
          stroke="#7ee0ff"
          strokeWidth="0.4"
        />
      </svg>
      <h1 className="cond__mark">{siteConfig.monogram}</h1>
      <p className="cond__hint">Skip</p>
    </div>
  );
}
