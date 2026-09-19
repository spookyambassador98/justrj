# HUD levels (parked)

Collapsible LEVEL 1 / 2 / 3 / NDA curtains for the Production HUD left index.

Removed from the live HUD on 2026-09-19. Flat project list is in `ProductionHUD.tsx` now.

## Wire back

1. Import `HudLevelIndex`, `levelOf`, and `LevelKey` from this folder.
2. Restore `openLevel` state and `grouped` in `ProductionHUD`.
3. Replace the flat `<aside>` list with `<HudLevelIndex … />`.
4. Fill `PROJECT_LEVEL` in `HudLevelIndex.tsx` (anything unlisted falls into NDA).
5. CSS is already in `app/globals.css`: `.hud-node`, `.hud-node.is-open`, `.hud-node.is-nda`.

Placeholder copy while levels were live: “SELECT A LEVEL TO BEGIN”.
