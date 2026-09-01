"use client";

import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSim } from "@/lib/sim/store";
import { SUN_DIR } from "./sparks";
import { Activity } from "./Activity";
import { CameraRig } from "./CameraRig";
import { Earth } from "./Earth";

function SimClock() {
  useFrame((_, dt) => {
    useSim.getState().tick(Math.min(dt, 0.05));
  });
  return null;
}

function Sun() {
  const pos = SUN_DIR.clone().multiplyScalar(18);
  return (
    <>
      <directionalLight position={[pos.x, pos.y, pos.z]} intensity={2.2} color="#fff1d0" />
      <hemisphereLight args={["#1a3355", "#09080a", 0.3]} />
      <ambientLight intensity={0.045} />
      <mesh position={[pos.x, pos.y, pos.z]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#fff6d8" />
      </mesh>
    </>
  );
}

export function Scene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 12, 48]} />
      <SimClock />
      <Sun />
      <Stars
        radius={60}
        depth={28}
        count={reduced ? 1400 : 4500}
        factor={2.8}
        saturation={0}
        fade
        speed={reduced ? 0 : 0.35}
      />
      <Earth reduced={reduced} />
      <Activity reduced={reduced} />
      <CameraRig reduced={reduced} />
    </>
  );
}

void THREE;
