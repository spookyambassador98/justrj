# RJ Portfolio — Architecture

Clinical aerospace / advanced engineering lab. Absolute dark `#020202`. No sci-fi clichés. Real captures only.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router |
| Styling | Tailwind CSS 4 |
| Motion | Framer Motion + Lenis |
| 3D | R3F · Drei · custom clinical shaders |

## App Router

```
app/
├── page.tsx
├── layout.tsx                         # SignalLockIntro via PortfolioShell
├── site.config.ts
├── projects/data.ts                   # verified cases + screenshot paths
│
├── components/
│   ├── hero/HeroSurface.tsx           # Engineering Core
│   ├── production/
│   │   ├── ProductionHUD.tsx          # showcase + facts
│   │   └── BlueprintViewer.tsx        # R3F 3D screenshot planes
│   ├── three/NeuralCanvas.tsx · Wormhole.tsx · NeuralNetwork.tsx
│   ├── motion/SignalLockIntro.tsx · SmoothScroll.tsx
│   └── ui/RecruiterBrief.tsx · HireStrip.tsx · MagneticButton.tsx
│
public/showcase-images/{orbital|asema|eye-master|foamcore}/{en|ru|uk}/*.png
lib/motion.ts
```

## Visual evidence pipeline

1. `projects/data.ts` → `shot()` / `resolveShot(lang)`
2. `evidenceFromProject()` collects hero + feature captures (max 6)
3. `BlueprintViewer` mounts textured planes with:
   - mouse parallax tilt
   - clinical glass refraction shader
   - glassmorphism HUD frame + shot strip

## Data integrity

HUD metrics: `year`, `features.length`, `tech.length`, demo `link` presence, plus `problem` / `build` / `result` / `architecture`.
Screenshots: only files under `public/showcase-images/`.
