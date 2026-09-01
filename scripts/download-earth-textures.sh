#!/bin/sh
set -eu
ROOT="${1:-.}"
mkdir -p "$ROOT/public/earth" "$ROOT/public"

# Day map (Blue Marble)
curl -L --fail -o "$ROOT/public/earth/day.jpg" "https://cdn.jsdelivr.net/npm/three-globe@2.44.1/example/img/earth-blue-marble.jpg" \
  || curl -L --fail -o "$ROOT/public/earth/day.jpg" "https://unpkg.com/three-globe@2.44.1/example/img/earth-blue-marble.jpg"

# Night lights
curl -L --fail -o "$ROOT/public/earth/night.jpg" "https://cdn.jsdelivr.net/npm/three-globe@2.44.1/example/img/earth-night.jpg" \
  || curl -L --fail -o "$ROOT/public/earth/night.jpg" "https://unpkg.com/three-globe@2.44.1/example/img/earth-night.jpg"

# Bump / topology
curl -L --fail -o "$ROOT/public/earth/bump.jpg" "https://cdn.jsdelivr.net/npm/three-globe@2.44.1/example/img/earth-topology.png" \
  || curl -L --fail -o "$ROOT/public/earth/bump.jpg" "https://unpkg.com/three-globe@2.44.1/example/img/earth-topology.png"

# Clouds (best-effort)
curl -L --fail -o "$ROOT/public/earth/clouds.png" "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r170/examples/textures/planets/earth_clouds_1024.png" || true
curl -L --fail -o "$ROOT/public/earth/clouds.jpg" "https://threejs.org/examples/textures/planets/earth_clouds_1024.png" || true

ls -la "$ROOT/public/earth/"
