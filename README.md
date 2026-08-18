# RJ Classified Ops Portal

Ultra-premium Personal Portfolio & Recruiter Portal — aerospace / neural-synthesis lab aesthetic.

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Framer Motion** + **Lenis**
- **React Three Fiber** + Drei (Neural Canvas & Wormhole)
- **GSAP** (neural fiber pulses)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full App Router layout.

## Core surfaces

| Surface | Path |
|---------|------|
| Signal Lock intro | `app/components/motion/SignalLockIntro.tsx` |
| Hero (Neural + Wormhole) | `app/components/hero/HeroSurface.tsx` + `three/` |
| Diagnostics HUD | `app/components/diagnostics/DiagnosticsHUD.tsx` |
| Recruiter Brief terminal | `app/components/ui/RecruiterBrief.tsx` |
| Hire Strip | `app/components/ui/HireStrip.tsx` |

Toggle **Recruiter mode** via the bottom HireStrip to enter the classified NDA terminal.
