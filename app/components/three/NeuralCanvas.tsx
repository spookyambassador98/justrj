"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { NeuralNetwork } from "./NeuralNetwork";

/**
 * Neuron backdrop — myvis framing, soft so it doesn't punch through the desk.
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
      {/* Keep neurons readable on the right, quiet behind copy/HUD */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, rgba(2,2,2,0.78) 0%, rgba(2,2,2,0.35) 42%, transparent 72%),
            linear-gradient(180deg, transparent 40%, rgba(2,2,2,0.55) 78%, #020202 100%)
          `,
        }}
      />
    </div>
  );
}
