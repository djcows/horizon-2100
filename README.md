# Horizon 2100

Cinematic 3D Earth visualization of the **physical AI takeoff** — 1 billion humanoids by 2036, through 2100.

Drop these files into a Grok App Builder / TanStack Start workspace (`/workspace`) on top of the stock template.

## Layout

```
src/router.tsx
src/routes/__root.tsx
src/routes/index.tsx
src/styles.css
src/components/globe/
  GlobeApp.tsx      # Canvas host + HUD overlay
  Scene.tsx         # clock, sun, stars
  Earth.tsx         # day/night shader, clouds, atmosphere
  Activity.tsx      # beams, arcs, particles, labels
  CameraRig.tsx     # orbit + event fly-tos
  Hud.tsx           # mission-control overlay
  sparks.ts         # textures, great-circles, scales
src/lib/sim/{geo,projections,hotspots,events,store}.ts
public/favicon.svg
startup.sh
scripts/download-earth-textures.sh
```

## Install (in the App Builder workspace)

```bash
cd /workspace
# copy this repo's src/components/globe, src/lib/sim, src/styles.css, scripts, startup.sh
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
chmod +x scripts/download-earth-textures.sh startup.sh
sh scripts/download-earth-textures.sh /workspace
npm run dev   # 0.0.0.0:8080 — via scripts/with-app-env.mjs only
```

Do **not** install rapier. Do **not** add auth routes. Do **not** start from this GitHub repo as a greenfield app — it expects the Grok App Builder template (`src/lib/auth`, `src/lib/db.ts`, `vite.config.ts`).

## Scenario

Physical AI takeoff aligned with Musk / Adcock: **1B humanoids in 2036**, not Morgan Stanley's 2050 case. Humans: UN WPP 2024 medium. Unemployment and GDP modeled from robot labor substitution + 24/7 productivity.
