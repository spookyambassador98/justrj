"use client";

import { useEffect, useRef, useState } from "react";
import { useViewport } from "../../hooks/useViewport";

const LABELS: Record<string, string> = {
  cta: "Open ↗",
  project: "Inspect",
  drag: "Drag",
  mail: "Write",
};

export function InstrumentCursor() {
  const { isCoarse, reduceMotion } = useViewport();
  const el = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hot, setHot] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (isCoarse || reduceMotion) return;

    const node = el.current;
    if (!node) return;

    document.documentElement.classList.add("has-instrument-cursor");
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setOn(true);
      const hit = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as
        | HTMLElement
        | null;
      const mode = hit?.dataset.cursor || "";
      setHot(Boolean(mode));
      setLabel(LABELS[mode] || "");
    };

    const onLeave = () => setOn(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-instrument-cursor");
    };
  }, [isCoarse, reduceMotion]);

  if (isCoarse || reduceMotion) return null;

  return (
    <div
      ref={el}
      className={`reticle${hot ? " is-hot" : ""}`}
      aria-hidden
      style={{ opacity: on ? 1 : 0 }}
    >
      <span className="reticle__hair reticle__hair--h" />
      <span className="reticle__hair reticle__hair--v" />
      <span className="reticle__ring" />
      <span className="reticle__label">{label}</span>
    </div>
  );
}
