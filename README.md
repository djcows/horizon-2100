# Horizon 2100

Cinematic 3D Earth visualization of the **physical AI takeoff** — 1 billion humanoids by 2036, through 2100.

This repo holds the **foundation** (sim library, app shell, globe stub). Drop these files into a Grok App Builder / TanStack Start workspace (`/workspace`) on top of the stock template.

## Layout

```
src/router.tsx
src/routes/__root.tsx          # Horizon 2100 shell, AuthProvider + PreviewHostBridge
src/routes/index.tsx           # client-only gate so three.js never SSR-crashes
src/styles.css
src/components/globe/GlobeApp.tsx   # stub — 3D/HUD comes next
src/lib/sim/geo.ts
src/lib/sim/projections.ts     # robots / humans / unemployment / GDP 2026–2100
src/lib/sim/hotspots.ts        # ~70 cities + supply-chain arcs
src/lib/sim/events.ts          # timeline fly-tos
src/lib/sim/store.ts           # zustand clock
public/favicon.svg
startup.sh                     # 0.0.0.0:8080 revive contract
scripts/download-earth-textures.sh
```

## Install (in the App Builder workspace)

```bash
cd /workspace
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
sh scripts/download-earth-textures.sh /workspace
chmod +x startup.sh
```

Do **not** install rapier. Do **not** add auth routes. Do **not** start from this GitHub repo as a greenfield app — it expects the Grok App Builder template (`src/lib/auth`, `src/lib/db.ts`, `vite.config.ts`).

## Scenario

Physical AI takeoff aligned with Musk / Adcock: **1B humanoids in 2036**, not Morgan Stanley's 2050 case. Humans: UN WPP 2024 medium. Unemployment and GDP modeled from robot labor substitution + 24/7 productivity.
