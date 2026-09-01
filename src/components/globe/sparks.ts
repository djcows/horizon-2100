"use client";

import * as THREE from "three";
import { EARTH_RADIUS, latLonToXYZ } from "@/lib/sim/geo";

export const SUN_DIR = new THREE.Vector3(5.5, 1.8, 3.2).normalize();

export const KIND_HEX: Record<string, string> = {
  factory: "#3ee0c5",
  city: "#e8b86d",
  port: "#6ec8e8",
  hub: "#7eb8d4",
};

export const KIND_CUE: Record<string, string> = {
  factory: "FACTORY LINE",
  city: "CITY DEPLOY",
  port: "PORT LOGISTICS",
  hub: "COMMAND HUB",
};

export function robotActivity(robots: number): number {
  const log = Math.log10(Math.max(robots, 1));
  return Math.min(1, Math.max(0, (log - 4.8) / 6.2));
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function greatCirclePoints(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  segments = 48,
  bump = 0.28,
): THREE.Vector3[] {
  const a = latLonToXYZ(lat1, lon1, 1);
  const b = latLonToXYZ(lat2, lon2, 1);
  const va = new THREE.Vector3(a.x, a.y, a.z);
  const vb = new THREE.Vector3(b.x, b.y, b.z);
  const omega = Math.acos(Math.min(1, Math.max(-1, va.dot(vb))));
  const so = Math.sin(omega);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let p: THREE.Vector3;
    if (so < 1e-5) p = va.clone();
    else {
      p = va
        .clone()
        .multiplyScalar(Math.sin((1 - t) * omega) / so)
        .add(vb.clone().multiplyScalar(Math.sin(t * omega) / so));
    }
    const lift = Math.sin(t * Math.PI) * bump;
    p.normalize().multiplyScalar(EARTH_RADIUS + 0.034 + lift);
    pts.push(p);
  }
  return pts;
}

function fillEllipse(
  ctx: CanvasRenderingContext2D,
  lon: number,
  lat: number,
  rx: number,
  ry: number,
  color: string,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const cx = ((lon + 180) / 360) * w;
  const cy = ((90 - lat) / 180) * h;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * w, ry * h, 0, 0, Math.PI * 2);
  ctx.fill();
  if (cx < rx * w) {
    ctx.beginPath();
    ctx.ellipse(cx + w, cy, rx * w, ry * h, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (cx > w - rx * w) {
    ctx.beginPath();
    ctx.ellipse(cx - w, cy, rx * w, ry * h, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintContinents(
  ctx: CanvasRenderingContext2D,
  land: string,
  desert: string,
  ice: string,
) {
  fillEllipse(ctx, -100, 45, 0.12, 0.14, land);
  fillEllipse(ctx, -88, 38, 0.08, 0.08, land);
  fillEllipse(ctx, -112, 54, 0.1, 0.08, land);
  fillEllipse(ctx, -68, -10, 0.07, 0.16, land);
  fillEllipse(ctx, -62, -20, 0.055, 0.12, land);
  fillEllipse(ctx, 18, 8, 0.07, 0.16, land);
  fillEllipse(ctx, 22, 0, 0.05, 0.12, desert);
  fillEllipse(ctx, 12, 50, 0.08, 0.07, land);
  fillEllipse(ctx, 40, 54, 0.09, 0.05, land);
  fillEllipse(ctx, 80, 50, 0.16, 0.1, land);
  fillEllipse(ctx, 100, 35, 0.12, 0.1, land);
  fillEllipse(ctx, 78, 22, 0.055, 0.07, desert);
  fillEllipse(ctx, 114, 22, 0.04, 0.05, land);
  fillEllipse(ctx, 134, -25, 0.055, 0.05, desert);
  fillEllipse(ctx, 165, -42, 0.03, 0.06, land);
  fillEllipse(ctx, 37, 25, 0.04, 0.04, desert);
  fillEllipse(ctx, -42, 72, 0.06, 0.05, ice);
  fillEllipse(ctx, 0, 90, 0.5, 0.06, ice);
  fillEllipse(ctx, 0, -90, 0.5, 0.07, ice);
  fillEllipse(ctx, 46, 62, 0.12, 0.05, land);
  fillEllipse(ctx, 105, 60, 0.14, 0.06, land);
}

export function makeDayTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(0, "#7ea8c9");
  g.addColorStop(0.18, "#0c4a7a");
  g.addColorStop(0.5, "#083868");
  g.addColorStop(0.82, "#0c4a7a");
  g.addColorStop(1, "#c5d6e4");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  paintContinents(ctx, "#2f6b3c", "#8a7a42", "#e4eef6");
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function makeNightTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#02040c";
  ctx.fillRect(0, 0, c.width, c.height);
  paintContinents(ctx, "#08140c", "#12100a", "#0c1218");
  const rng = mulberry32(2100);
  for (let i = 0; i < 1800; i++) {
    const x = rng() * c.width;
    const y = (0.18 + rng() * 0.62) * c.height;
    const r = rng() * 1.4 + 0.3;
    const a = 0.25 + rng() * 0.75;
    ctx.fillStyle = `rgba(255, ${200 + rng() * 40}, ${120 + rng() * 60}, ${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const clusters: [number, number][] = [
    [-74, 41], [-118, 34], [-87, 42], [-0.1, 51], [2.3, 49], [13.4, 52],
    [139.7, 35.7], [126.9, 37.5], [121.5, 31.2], [114.1, 22.5], [77.6, 12.9],
    [72.8, 19.1], [103.8, 1.35], [55.3, 25.2], [151.2, -33.9], [-46.6, -23.5],
    [28.0, -26.2], [31.2, 30.0], [37.6, 55.7], [-79.4, 43.7],
  ];
  for (const [lon, lat] of clusters) {
    const cx = ((lon + 180) / 360) * c.width;
    const cy = ((90 - lat) / 180) * c.height;
    for (let i = 0; i < 40; i++) {
      const x = cx + (rng() - 0.5) * 18;
      const y = cy + (rng() - 0.5) * 10;
      ctx.fillStyle = `rgba(255, 220, 140, ${0.4 + rng() * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.6 + rng() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function makeCloudTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, c.width, c.height);
  const rng = mulberry32(77);
  for (let i = 0; i < 420; i++) {
    const x = rng() * c.width;
    const y = rng() * c.height;
    const r = 12 + rng() * 48;
    const a = 0.04 + rng() * 0.16;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.4 + rng() * 0.5), rng() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function loadTexture(url: string): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (t) => resolve(t),
      undefined,
      () => resolve(null),
    );
  });
}

export function prepColorMap(t: THREE.Texture) {
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}
