"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { NeuralNetwork } from "./NeuralNetwork";
import { useViewport } from "../../hooks/useViewport";

/**
 * Neuron backdrop — keep the network itself; only the framing overlay changes
 * so type can cut a window into the field.
 *
 * Phone notes:
 * - The canvas box is sized to the *large* viewport (100lvh), not `inset-0`.
 *   On iOS/Android the URL bar collapses while scrolling, which changes the
 *   small viewport every few pixels; a fixed `inset-0` canvas was resized on
 *   every scroll step, reallocating the WebGL drawing buffer each time — the
 *   jank / "page reloaded" crash on phones.
 * - Touch devices render at DPR 1 without MSAA (same scene, ~2× fewer pixels).
 * - Rendering pauses while the tab is hidden or the context is lost.
 */
export function NeuralCanvas({ active }: { active: boolean }) {
  const { ready, lite } = useViewport();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      className="neural-backdrop pointer-events-none fixed left-0 top-0 z-0 w-full"
      aria-hidden
    >
      {ready && (
        <Canvas
          key={lite ? "neural-lite" : "neural-full"}
          camera={{ position: [0, 0, 11], fov: 55 }}
          dpr={lite ? 1 : [1, 1.5]}
          frameloop={visible ? "always" : "never"}
          resize={{ scroll: false, debounce: { scroll: 0, resize: 200 } }}
          gl={{
            antialias: !lite,
            alpha: true,
            powerPreference: lite ? "default" : "high-performance",
          }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvas.addEventListener("webglcontextlost", (e) => e.preventDefault());
          }}
        >
          <fog attach="fog" args={["#070f1c", 20, 48]} />
          <Suspense fallback={null}>
            <NeuralNetwork active={active} />
          </Suspense>
        </Canvas>
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 72% at 55% 42%, transparent 8%, rgba(5,7,12,0.28) 58%, #05070c 100%)
          `,
        }}
      />
    </div>
  );
}
