"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { NeuralNetwork } from "./NeuralNetwork";

/**
 * Neuron backdrop — keep the network itself; only the framing overlay changes
 * so type can cut a window into the field.
 */
export function NeuralCanvas({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        key="neural-midnight-whisper"
        camera={{ position: [0, 0, 11], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <fog attach="fog" args={["#070f1c", 20, 48]} />
        <Suspense fallback={null}>
          <NeuralNetwork active={active} />
        </Suspense>
      </Canvas>
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
