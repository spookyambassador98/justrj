"use client";
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

type FiberPulse = {
  path: number[];
  t: number;
  speed: number;
  trail: number;
  litStart: boolean;
  litEnd: boolean;
  lastHop: number;
};

export function NeuralNetwork({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Points>(null);
  const haloRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const fiberRef = useRef<THREE.LineSegments>(null);
  const fiberCoreRef = useRef<THREE.LineSegments>(null);
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);
  const haloMatRef = useRef<THREE.ShaderMaterial>(null);
  const linesMatRef = useRef<THREE.LineBasicMaterial>(null);
  const fiberMatRef = useRef<THREE.LineBasicMaterial>(null);
  const fiberCoreMatRef = useRef<THREE.LineBasicMaterial>(null);
  const { viewport } = useThree();

  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  const sceneOpacity = useRef({ value: 0 });
  const pulses = useRef<FiberPulse[]>([]);
  const edges = useRef<[number, number][]>([]);
  const edgeSet = useRef<Set<string>>(new Set());
  const adj = useRef<number[][]>([]);
  const spawnCd = useRef(0.35);
  const seeded = useRef(false);

  // Same density/look on every device — no mobile "lite" visual branch
  const particleCount = 320;
  const maxDistance = 3.8;
  const MAX_PULSES = 5;
  const STROKE_SEGS = 22;
  const maxLineVerts = particleCount * (particleCount - 1);
  const maxFiberVerts = MAX_PULSES * STROKE_SEGS * 2;

  const edgeKey = (a: number, b: number) => (a < b ? `${a}_${b}` : `${b}_${a}`);

  const softTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.1, 'rgba(255,255,255,1)');
    g.addColorStop(0.28, 'rgba(255,255,255,0.5)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.14)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  const nodeShader = useMemo(
    () => ({
      uniforms: {
        uMap: { value: softTexture },
        uOpacity: { value: 0 },
        uTime: { value: 0 },
        uHalo: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aSeed;
        attribute float aPulse;
        attribute float aSynapse;
        varying float vPulse;
        varying float vSynapse;
        uniform float uTime;
        uniform float uHalo;
        void main() {
          vPulse = aPulse;
          vSynapse = aSynapse;
          float breath = 1.0 + 0.1 * sin(uTime * 1.0 + aSeed);
          float sz = aSize * breath * (uHalo > 0.5 ? 3.2 : 1.05);
          sz *= 1.0 + aPulse * (uHalo > 0.5 ? 0.65 : 0.4);
          // Synaptic nodes bloom a bit larger — elegant, not neon
          sz *= 1.0 + aSynapse * (uHalo > 0.5 ? 0.95 : 0.55);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = sz * (300.0 / max(0.1, -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uOpacity;
        uniform float uHalo;
        varying float vPulse;
        varying float vSynapse;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          // Cool steel base → ice core
          vec3 steel = vec3(0.42, 0.58, 0.78);
          vec3 ice = vec3(0.82, 0.92, 1.0);
          // Whisper tones — only as soft gleams on the brightest nodes
          vec3 midnight = vec3(0.06, 0.14, 0.34);
          vec3 coldCyan = vec3(0.38, 0.80, 0.98);
          vec3 pearl = vec3(0.94, 0.98, 1.0);

          vec3 col = mix(steel, ice, 0.4 + vPulse * 0.5);
          float gleam = pow(clamp(max(vPulse * 0.85, vSynapse), 0.0, 1.0), 1.45);

          // Soft cyan highlights — never a flat wash
          col = mix(col, coldCyan, gleam * 0.32);
          // Ultra-deep obsidian-blue whisper in the bloom
          if (uHalo > 0.5) {
            col = mix(col, mix(midnight, coldCyan, 0.55), gleam * 0.38);
          } else {
            col = mix(col, mix(coldCyan, pearl, 0.45), gleam * 0.22);
          }

          // Synaptic nodes: pearl kiss on top of the whisper
          col = mix(col, pearl, clamp(vSynapse, 0.0, 1.0) * 0.55);

          float a = tex.a * uOpacity;
          if (uHalo > 0.5) {
            a *= 0.38 + vPulse * 0.22 + vSynapse * 0.55;
          } else {
            a *= 0.95 + vPulse * 0.2 + vSynapse * 0.55;
          }
          if (a < 0.01) discard;
          gl_FragColor = vec4(col, a);
        }
      `,
    }),
    [softTexture]
  );

  const data = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel: THREE.Vector3[] = [];
    const seedArr = new Float32Array(particleCount);
    const sizeArr = new Float32Array(particleCount);
    const pulseArr = new Float32Array(particleCount);
    const synapseArr = new Float32Array(particleCount);
    adj.current = Array.from({ length: particleCount }, () => []);
    for (let i = 0; i < particleCount; i++) {
      const biasX = (Math.random() * Math.random()) * 8;
      pos[i * 3] = (Math.random() - 0.45) * 36 + biasX;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
      vel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.005
        )
      );
      seedArr[i] = Math.random() * Math.PI * 2;
      sizeArr[i] = 0.1 + Math.random() * 0.14;
      pulseArr[i] = 0;
      synapseArr[i] = 0;
    }
    return {
      positions: pos,
      velocities: vel,
      seeds: seedArr,
      sizes: sizeArr,
      pulses: pulseArr,
      synapses: synapseArr,
      linesData: new Float32Array(maxLineVerts * 3),
      fiberPos: new Float32Array(maxFiberVerts * 3),
      fiberCol: new Float32Array(maxFiberVerts * 3),
      corePos: new Float32Array(maxFiberVerts * 3),
      coreCol: new Float32Array(maxFiberVerts * 3),
    };
  }, [maxLineVerts, maxFiberVerts]);

  const {
    positions,
    velocities,
    seeds,
    sizes,
    pulses: nodePulses,
    synapses,
    linesData,
    fiberPos,
    fiberCol,
    corePos,
    coreCol,
  } = data;

  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);

  /** Sample strictly on nerve segments (linear per edge — never cuts through void) */
  const samplePath = (path: number[], u: number, out: THREE.Vector3) => {
    const hops = path.length - 1;
    if (hops < 1) {
      out.set(0, 0, 0);
      return;
    }
    const clamped = Math.max(0, Math.min(0.9999, u));
    const f = clamped * hops;
    const i = Math.min(hops - 1, f | 0);
    const local = f - i;
    const a = path[i];
    const b = path[i + 1];
    out.set(
      positions[a * 3] + (positions[b * 3] - positions[a * 3]) * local,
      positions[a * 3 + 1] + (positions[b * 3 + 1] - positions[a * 3 + 1]) * local,
      positions[a * 3 + 2] + (positions[b * 3 + 2] - positions[a * 3 + 2]) * local
    );
  };

  const buildPath = (startA: number, startB: number, hops: number) => {
    const path = [startA, startB];
    let prev = startA;
    let cur = startB;
    for (let h = 1; h < hops; h++) {
      const neighbors = adj.current[cur]?.filter((n) => n !== prev && !path.includes(n)) ?? [];
      if (!neighbors.length) break;
      const next = neighbors[(Math.random() * neighbors.length) | 0];
      path.push(next);
      prev = cur;
      cur = next;
    }
    return path;
  };

  useEffect(() => {
    gsap.to(sceneOpacity.current, {
      value: active ? 1 : 0,
      duration: active ? 2 : 1.4,
      ease: active ? 'power2.in' : 'power2.out',
      onUpdate: () => {
        const v = sceneOpacity.current.value;
        if (coreMatRef.current) coreMatRef.current.uniforms.uOpacity.value = v * 1.1;
        if (haloMatRef.current) haloMatRef.current.uniforms.uOpacity.value = v * 1.35;
        if (linesMatRef.current) linesMatRef.current.opacity = 0.28 * v;
        if (fiberMatRef.current) fiberMatRef.current.opacity = 0.95 * v;
        if (fiberCoreMatRef.current) fiberCoreMatRef.current.opacity = v;
      },
    });
  }, [active]);

  useFrame((state, delta) => {
    if (!coreRef.current || !haloRef.current || !linesRef.current || !fiberRef.current || !fiberCoreRef.current) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    smoothMouse.current.lerp(state.mouse, 0.05);

    // Keep the same visual density/framing on portrait phones as on desktop
    const aspect = viewport.width / Math.max(viewport.height, 0.01);
    const targetZ = aspect < 1 ? 13.2 : 11;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06);

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, smoothMouse.current.x * 0.1, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -smoothMouse.current.y * 0.08, 0.04);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, smoothMouse.current.x * 0.25, 0.03);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, smoothMouse.current.y * 0.18, 0.03);
    }

    if (coreMatRef.current) coreMatRef.current.uniforms.uTime.value = time;
    if (haloMatRef.current) haloMatRef.current.uniforms.uTime.value = time;

    let vertexpos = 0;
    let numConnected = 0;
    edges.current.length = 0;
    edgeSet.current.clear();
    for (let i = 0; i < particleCount; i++) adj.current[i].length = 0;

    const mouse3D = new THREE.Vector3(
      (smoothMouse.current.x * viewport.width) / 2,
      (smoothMouse.current.y * viewport.height) / 2,
      0
    );

    for (let i = 0; i < particleCount; i++) {
      // Slow elegant fade — glow lingers a moment after fire/receive
      synapses[i] = THREE.MathUtils.lerp(synapses[i], 0, 0.022);

      positions[i * 3] += velocities[i].x + Math.sin(time * 0.4 + seeds[i]) * 0.0025;
      positions[i * 3 + 1] += velocities[i].y + Math.cos(time * 0.35 + seeds[i]) * 0.0025;
      positions[i * 3 + 2] += velocities[i].z;

      if (Math.abs(positions[i * 3]) > 19) velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 13) velocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 4.5) velocities[i].z *= -1;

      const dxm = positions[i * 3] - mouse3D.x;
      const dym = positions[i * 3 + 1] - mouse3D.y;
      const distM = Math.sqrt(dxm * dxm + dym * dym);
      if (distM < 5 && distM > 0.01) {
        const f = (5 - distM) * 0.01;
        positions[i * 3] += (dxm / distM) * f;
        positions[i * 3 + 1] += (dym / distM) * f;
        nodePulses[i] = Math.min(1, nodePulses[i] + 0.04);
      }

      const idle = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(time * 0.7 + seeds[i]));
      nodePulses[i] = THREE.MathUtils.lerp(nodePulses[i], idle, 0.025);

      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDistance) {
          linesData[vertexpos++] = positions[i * 3];
          linesData[vertexpos++] = positions[i * 3 + 1];
          linesData[vertexpos++] = positions[i * 3 + 2];
          linesData[vertexpos++] = positions[j * 3];
          linesData[vertexpos++] = positions[j * 3 + 1];
          linesData[vertexpos++] = positions[j * 3 + 2];
          edges.current.push([i, j]);
          edgeSet.current.add(edgeKey(i, j));
          adj.current[i].push(j);
          adj.current[j].push(i);
          numConnected++;
        }
      }
    }

    // Lock every nerve the active pulses travel on until they finish
    for (const p of pulses.current) {
      for (let h = 0; h < p.path.length - 1; h++) {
        const a = p.path[h];
        const b = p.path[h + 1];
        const key = edgeKey(a, b);
        if (edgeSet.current.has(key)) continue;
        linesData[vertexpos++] = positions[a * 3];
        linesData[vertexpos++] = positions[a * 3 + 1];
        linesData[vertexpos++] = positions[a * 3 + 2];
        linesData[vertexpos++] = positions[b * 3];
        linesData[vertexpos++] = positions[b * 3 + 1];
        linesData[vertexpos++] = positions[b * 3 + 2];
        edgeSet.current.add(key);
        adj.current[a].push(b);
        adj.current[b].push(a);
        numConnected++;
      }
    }

    const lightNode = (idx: number, amount: number) => {
      synapses[idx] = Math.max(synapses[idx], amount);
      nodePulses[idx] = Math.max(nodePulses[idx], 0.5 + amount * 0.45);
    };

    const spawn = () => {
      if (!edges.current.length || pulses.current.length >= MAX_PULSES) return;
      let e = edges.current[(Math.random() * edges.current.length) | 0];
      for (let tries = 0; tries < 10; tries++) {
        const cand = edges.current[(Math.random() * edges.current.length) | 0];
        const dx = positions[cand[0] * 3] - positions[cand[1] * 3];
        const dy = positions[cand[0] * 3 + 1] - positions[cand[1] * 3 + 1];
        const dz = positions[cand[0] * 3 + 2] - positions[cand[1] * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > 1.5 && d < maxDistance * 0.92) {
          e = cand;
          break;
        }
      }
      const flip = Math.random() > 0.5;
      const a = flip ? e[1] : e[0];
      const b = flip ? e[0] : e[1];
      const hops = 2 + ((Math.random() * 3) | 0); // 2–4 edges → visible fiber turns
      const path = buildPath(a, b, hops);
      if (path.length < 2) return;
      pulses.current.push({
        path,
        t: 0, // always start at ignition so sender glow is never skipped
        speed: 0.14 + Math.random() * 0.07,
        trail: 0.14 + Math.random() * 0.08,
        litStart: false,
        litEnd: false,
        lastHop: 0,
      });
    };

    if (active && !seeded.current && edges.current.length > 25) {
      for (let i = 0; i < 3; i++) spawn();
      seeded.current = true;
    }

    spawnCd.current -= dt;
    if (active && pulses.current.length < MAX_PULSES && spawnCd.current <= 0) {
      spawn();
      spawnCd.current = 0.55 + Math.random() * 0.9;
    }

    const alive: FiberPulse[] = [];
    fiberPos.fill(0);
    fiberCol.fill(0);
    corePos.fill(0);
    coreCol.fill(0);
    let fiberVerts = 0;

    for (const p of pulses.current) {
      const startNode = p.path[0];
      const endNode = p.path[p.path.length - 1];

      // 1) Sender lights once at ignition, then soft envelope while leaving
      if (!p.litStart) {
        lightNode(startNode, 1);
        p.litStart = true;
      }

      p.t += p.speed * dt;

      // 2) Receiver lights ONLY on arrival — never while in flight
      if (p.t >= 1) {
        if (!p.litEnd) {
          lightNode(endNode, 1);
          p.litEnd = true;
        }
        continue;
      }

      // Keep sender slightly warm only in the first part of the flight
      if (p.t < 0.4) {
        const sendHold = Math.pow(1 - p.t / 0.4, 1.35);
        lightNode(startNode, 0.35 + sendHold * 0.55);
      }

      const head = p.t;
      const trailEnd = Math.max(0, head - p.trail);
      const life = Math.sin(p.t * Math.PI);
      const hops = p.path.length - 1;
      const headHop = head * hops;
      const distToCorner = Math.abs(headHop - Math.round(headHop));
      // Soft attenuation at turns (fiber look), but stay on the nerve
      const turnFade = 0.7 + 0.3 * Math.min(1, distToCorner * 2.2);

      // Elegant flash when the impulse passes through intermediate nodes
      // (end node still waits for arrival — handled above)
      const crossed = Math.min(hops - 1, Math.floor(headHop + 0.12));
      while (p.lastHop < crossed) {
        p.lastHop++;
        if (p.lastHop > 0 && p.lastHop < hops) {
          lightNode(p.path[p.lastHop], 0.92);
        }
      }
      // Soft bloom while the head is near a node under the fiber
      const nearIdx = Math.min(hops - 1, Math.max(1, Math.round(headHop)));
      if (nearIdx > 0 && nearIdx < hops) {
        const near = 1 - Math.min(1, Math.abs(headHop - nearIdx) / 0.28);
        if (near > 0) {
          const bloom = near * near * (0.4 + 0.45 * life);
          lightNode(p.path[nearIdx], bloom);
        }
      }

      for (let s = 0; s < STROKE_SEGS; s++) {
        const k0 = s / STROKE_SEGS;
        const k1 = (s + 1) / STROKE_SEGS;
        const u0 = trailEnd + (head - trailEnd) * k0;
        const u1 = trailEnd + (head - trailEnd) * k1;
        samplePath(p.path, u0, tmpA);
        samplePath(p.path, u1, tmpB);

        const i0 = fiberVerts * 3;
        const i1 = (fiberVerts + 1) * 3;
        fiberPos[i0] = tmpA.x;
        fiberPos[i0 + 1] = tmpA.y;
        fiberPos[i0 + 2] = tmpA.z;
        fiberPos[i1] = tmpB.x;
        fiberPos[i1 + 1] = tmpB.y;
        fiberPos[i1 + 2] = tmpB.z;

        // Fiber optic: cold cyan head with a midnight whisper in the bloom
        const bright0 = Math.pow(k0, 1.55) * life * turnFade * 1.35;
        const bright1 = Math.pow(k1, 1.55) * life * turnFade * 1.35;
        fiberCol[i0] = 0.12 * bright0;
        fiberCol[i0 + 1] = 0.42 * bright0;
        fiberCol[i0 + 2] = 0.95 * bright0;
        fiberCol[i1] = 0.12 * bright1;
        fiberCol[i1 + 1] = 0.42 * bright1;
        fiberCol[i1 + 2] = 0.95 * bright1;

        corePos[i0] = tmpA.x;
        corePos[i0 + 1] = tmpA.y;
        corePos[i0 + 2] = tmpA.z;
        corePos[i1] = tmpB.x;
        corePos[i1 + 1] = tmpB.y;
        corePos[i1 + 2] = tmpB.z;
        const c0 = Math.pow(k0, 2.05) * life * turnFade * 1.45;
        const c1 = Math.pow(k1, 2.05) * life * turnFade * 1.45;
        coreCol[i0] = 0.45 * c0;
        coreCol[i0 + 1] = 0.82 * c0;
        coreCol[i0 + 2] = 1.0 * c0;
        coreCol[i1] = 0.45 * c1;
        coreCol[i1 + 1] = 0.82 * c1;
        coreCol[i1 + 2] = 1.0 * c1;

        fiberVerts += 2;
      }

      alive.push(p);
    }
    pulses.current = alive;

    coreRef.current.geometry.attributes.position.needsUpdate = true;
    coreRef.current.geometry.attributes.aPulse.needsUpdate = true;
    coreRef.current.geometry.attributes.aSynapse.needsUpdate = true;
    haloRef.current.geometry.attributes.position.needsUpdate = true;
    haloRef.current.geometry.attributes.aPulse.needsUpdate = true;
    haloRef.current.geometry.attributes.aSynapse.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, numConnected * 2);
    fiberRef.current.geometry.attributes.position.needsUpdate = true;
    fiberRef.current.geometry.attributes.color.needsUpdate = true;
    fiberRef.current.geometry.setDrawRange(0, fiberVerts);
    fiberCoreRef.current.geometry.attributes.position.needsUpdate = true;
    fiberCoreRef.current.geometry.attributes.color.needsUpdate = true;
    fiberCoreRef.current.geometry.setDrawRange(0, fiberVerts);
  });

  return (
    <group ref={groupRef}>
      <points ref={haloRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" count={particleCount} array={sizes} itemSize={1} />
          <bufferAttribute attach="attributes-aSeed" count={particleCount} array={seeds} itemSize={1} />
          <bufferAttribute attach="attributes-aPulse" count={particleCount} array={nodePulses} itemSize={1} />
          <bufferAttribute attach="attributes-aSynapse" count={particleCount} array={synapses} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={haloMatRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uMap: nodeShader.uniforms.uMap,
            uOpacity: { value: 0 },
            uTime: { value: 0 },
            uHalo: { value: 1 },
          }}
          vertexShader={nodeShader.vertexShader}
          fragmentShader={nodeShader.fragmentShader}
        />
      </points>
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" count={particleCount} array={sizes} itemSize={1} />
          <bufferAttribute attach="attributes-aSeed" count={particleCount} array={seeds} itemSize={1} />
          <bufferAttribute attach="attributes-aPulse" count={particleCount} array={nodePulses} itemSize={1} />
          <bufferAttribute attach="attributes-aSynapse" count={particleCount} array={synapses} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={coreMatRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uMap: nodeShader.uniforms.uMap,
            uOpacity: { value: 0 },
            uTime: { value: 0 },
            uHalo: { value: 0 },
          }}
          vertexShader={nodeShader.vertexShader}
          fragmentShader={nodeShader.fragmentShader}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={maxLineVerts} array={linesData} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={linesMatRef}
          color="#5b8fb8"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      {/* Soft fiber glow stroke */}
      <lineSegments ref={fiberRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={maxFiberVerts} array={fiberPos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={maxFiberVerts} array={fiberCol} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={fiberMatRef}
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      {/* Bright core filament */}
      <lineSegments ref={fiberCoreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={maxFiberVerts} array={corePos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={maxFiberVerts} array={coreCol} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={fiberCoreMatRef}
          vertexColors
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
