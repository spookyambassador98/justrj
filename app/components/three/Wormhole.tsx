"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Wormhole — polymer aperture / structural torus.
 * High-viscosity material feel. Clinical lighting. No neon sci-fi.
 */
export function Wormhole() {
  const group = useRef<THREE.Group>(null);
  const polymer = useRef<THREE.Mesh>(null);
  const rim = useRef<THREE.Mesh>(null);

  const polymerMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#1a1c1e"),
        metalness: 0.15,
        roughness: 0.18,
        transmission: 0.55,
        thickness: 1.4,
        ior: 1.48,
        transparent: true,
        opacity: 0.92,
        envMapIntensity: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
    []
  );

  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c8ced4"),
        metalness: 0.85,
        roughness: 0.28,
        emissive: new THREE.Color("#8a929a"),
        emissiveIntensity: 0.08,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = t * 0.06;
      group.current.rotation.x = 0.35 + Math.sin(t * 0.2) * 0.04;
      group.current.position.y = Math.sin(t * 0.35) * 0.08;
    }
    if (polymer.current) {
      polymer.current.scale.setScalar(1 + Math.sin(t * 0.45) * 0.012);
    }
    if (rim.current) {
      rim.current.rotation.z = -t * 0.09;
    }
  });

  return (
    <group ref={group} position={[2.4, -0.2, -2.5]}>
      <mesh ref={polymer} material={polymerMat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.42, 48, 96]} />
      </mesh>
      <mesh ref={rim} material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.035, 16, 96]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
        <ringGeometry args={[0.55, 1.12, 64]} />
        <meshBasicMaterial
          color="#d8dde2"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
