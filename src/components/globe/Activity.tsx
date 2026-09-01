"use client";

import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { EARTH_RADIUS, latLonToXYZ } from "@/lib/sim/geo";
import { ARCS, HOTSPOTS, HOTSPOT_BY_ID, intensity, type Hotspot } from "@/lib/sim/hotspots";
import { sample } from "@/lib/sim/projections";
import { useSim } from "@/lib/sim/store";
import { greatCirclePoints, KIND_CUE, KIND_HEX, mulberry32, robotActivity } from "./sparks";

const MAX_P = 1600;
const UP = new THREE.Vector3(0, 1, 0);
const _c = new THREE.Color();

function pulseAt(year: number, mark: number) {
  const d = Math.abs(year - mark);
  if (d > 0.55) return 0;
  return Math.exp(-d * d * 18);
}

export function Activity({ reduced }: { reduced: boolean }) {
  const beamMesh = useRef<THREE.InstancedMesh>(null);
  const glowMesh = useRef<THREE.InstancedMesh>(null);
  const ptsRef = useRef<THREE.Points>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [labels, setLabels] = useState<{ h: Hotspot; x: number; y: number; z: number }[]>([]);
  const labelTimer = useRef(0);

  const origins = useMemo(
    () =>
      HOTSPOTS.map((h) => {
        const p = latLonToXYZ(h.lat, h.lon, EARTH_RADIUS);
        const n = new THREE.Vector3(p.x, p.y, p.z).normalize();
        return { h, p, n, color: new THREE.Color(KIND_HEX[h.kind] ?? "#3ee0c5") };
      }),
    [],
  );

  const particleData = useMemo(() => {
    const rng = mulberry32(36);
    const pos = new Float32Array(MAX_P * 3);
    const col = new Float32Array(MAX_P * 3);
    const owner = new Uint16Array(MAX_P);
    const weights = origins.map((o) => o.h.weight);
    const sum = weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < MAX_P; i++) {
      let r = rng() * sum;
      let idx = 0;
      for (let k = 0; k < weights.length; k++) {
        r -= weights[k];
        if (r <= 0) {
          idx = k;
          break;
        }
      }
      const o = origins[idx];
      const latJ = o.h.lat + (rng() - 0.5) * 3.2;
      const lonJ = o.h.lon + (rng() - 0.5) * 4.4;
      const rad = EARTH_RADIUS + 0.02 + rng() * 0.08;
      const p = latLonToXYZ(latJ, lonJ, rad);
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
      col[i * 3] = o.color.r;
      col[i * 3 + 1] = o.color.g;
      col[i * 3 + 2] = o.color.b;
      owner[i] = idx;
    }
    return { pos, col, owner };
  }, [origins]);

  const arcGeoms = useMemo(
    () =>
      ARCS.map(([a, b]) => {
        const from = HOTSPOT_BY_ID[a];
        const to = HOTSPOT_BY_ID[b];
        if (!from || !to) return null;
        const pts = greatCirclePoints(from.lat, from.lon, to.lat, to.lon);
        const color = KIND_HEX[from.kind] ?? "#3ee0c5";
        return { from, to, pts, color };
      }).filter((x): x is NonNullable<typeof x> => x !== null),
    [],
  );

  useFrame((state, dt) => {
    const year = useSim.getState().year;
    const snap = sample(year);
    const act = robotActivity(snap.robots);
    const pulse =
      reduced ? 0 : Math.max(pulseAt(year, 2036), pulseAt(year, 2045) * 0.7, pulseAt(year, 2100) * 0.8);
    const t = state.clock.elapsedTime;

    if (beamMesh.current && glowMesh.current) {
      for (let i = 0; i < origins.length; i++) {
        const o = origins[i];
        const inten = intensity(o.h, year);
        const hgt = (0.07 + inten * (0.16 + act * 0.38)) * (1 + pulse * 1.35);
        const visible = inten > 0.01;
        dummy.position.copy(o.p).addScaledVector(o.n, visible ? hgt * 0.5 : -10);
        dummy.quaternion.setFromUnitVectors(UP, o.n);
        dummy.scale.set(0.55 + inten * 0.8, Math.max(hgt, 0.001), 0.55 + inten * 0.8);
        dummy.updateMatrix();
        beamMesh.current.setMatrixAt(i, dummy.matrix);
        _c.copy(o.color);
        beamMesh.current.setColorAt(i, _c);

        dummy.position.copy(o.p).addScaledVector(o.n, 0.03);
        dummy.quaternion.identity();
        const gs = visible ? 0.018 + inten * 0.03 * (1 + pulse) : 0.0001;
        dummy.scale.setScalar(gs);
        dummy.updateMatrix();
        glowMesh.current.setMatrixAt(i, dummy.matrix);
        glowMesh.current.setColorAt(i, _c);
      }
      beamMesh.current.instanceMatrix.needsUpdate = true;
      glowMesh.current.instanceMatrix.needsUpdate = true;
      if (beamMesh.current.instanceColor) beamMesh.current.instanceColor.needsUpdate = true;
      if (glowMesh.current.instanceColor) glowMesh.current.instanceColor.needsUpdate = true;
    }

    const visCount = Math.floor(80 + act * (MAX_P - 80));
    if (ptsRef.current) {
      const geo = ptsRef.current.geometry;
      geo.setDrawRange(0, visCount);
      const mat = ptsRef.current.material as THREE.PointsMaterial;
      const dist = state.camera.position.length();
      mat.size = dist < 3.0 ? 0.045 : 0.028;
      mat.opacity = 0.35 + act * 0.5;
      if (!reduced) {
        const arr = geo.attributes.position.array as Float32Array;
        for (let i = 0; i < visCount; i++) {
          const o = origins[particleData.owner[i]];
          if (intensity(o.h, year) <= 0) continue;
          const wobble = Math.sin(t * 1.7 + i * 0.13) * 0.002;
          arr[i * 3] = particleData.pos[i * 3] + o.n.x * wobble;
          arr[i * 3 + 1] = particleData.pos[i * 3 + 1] + o.n.y * wobble;
          arr[i * 3 + 2] = particleData.pos[i * 3 + 2] + o.n.z * wobble;
        }
        geo.attributes.position.needsUpdate = true;
      }
    }

    labelTimer.current += dt;
    if (labelTimer.current > 0.25) {
      labelTimer.current = 0;
      const dist = state.camera.position.length();
      if (dist < 3.0) {
        const ranked = origins
          .map((o) => ({ o, i: intensity(o.h, year) }))
          .filter((x) => x.i > 0.15)
          .sort((a, b) => b.i - a.i)
          .slice(0, 8)
          .map((x) => ({
            h: x.o.h,
            x: x.o.p.x + x.o.n.x * 0.12,
            y: x.o.p.y + x.o.n.y * 0.12,
            z: x.o.p.z + x.o.n.z * 0.12,
          }));
        setLabels(ranked);
      } else if (labels.length) setLabels([]);
    }
  });

  return (
    <group>
      <instancedMesh ref={beamMesh} args={[undefined, undefined, origins.length]}>
        <cylinderGeometry args={[0.006, 0.016, 1, 6, 1, true]} />
        <meshBasicMaterial
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          vertexColors
        />
      </instancedMesh>
      <instancedMesh ref={glowMesh} args={[undefined, undefined, origins.length]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshBasicMaterial
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          vertexColors
        />
      </instancedMesh>
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleData.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
      {arcGeoms.map((a) => (
        <ArcLine key={a.from.id + a.to.id} from={a.from} to={a.to} pts={a.pts} color={a.color} reduced={reduced} />
      ))}
      {labels.map((l) => (
        <Html
          key={l.h.id}
          position={[l.x, l.y, l.z]}
          center
          pointerEvents="none"
          zIndexRange={[1, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="hotspot-label">
            <div className="hotspot-label-name">{l.h.name}</div>
            <div className="hotspot-label-cue">{KIND_CUE[l.h.kind]}</div>
          </div>
        </Html>
      ))}
    </group>
  );
}

function ArcLine({
  from,
  to,
  pts,
  color,
  reduced,
}: {
  from: Hotspot;
  to: Hotspot;
  pts: THREE.Vector3[];
  color: string;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Object3D>(null);
  const opacity = useRef(0);
  useFrame((_, dt) => {
    const year = useSim.getState().year;
    const on = year >= from.startYear && year >= to.startYear;
    const target = on ? 0.62 : 0;
    opacity.current += (target - opacity.current) * Math.min(1, dt * 2.4);
    const obj = ref.current as unknown as { material?: THREE.Material | THREE.Material[] };
    const mat = obj?.material;
    const m = Array.isArray(mat) ? mat[0] : mat;
    if (m && "opacity" in m) {
      (m as THREE.LineBasicMaterial).opacity = opacity.current;
      if ("dashOffset" in m && !reduced) {
        (m as THREE.LineDashedMaterial).dashOffset -= dt * 0.35;
      }
    }
  });
  return (
    <Line
      ref={ref as never}
      points={pts}
      color={color}
      lineWidth={1.25}
      transparent
      opacity={0}
      dashed
      dashSize={0.09}
      gapSize={0.05}
      depthWrite={false}
    />
  );
}
