"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { currentEvent } from "@/lib/sim/events";
import { latLonToXYZ } from "@/lib/sim/geo";
import { HOTSPOT_BY_ID } from "@/lib/sim/hotspots";
import { START_YEAR } from "@/lib/sim/projections";
import { useSim } from "@/lib/sim/store";

type Controls = {
  autoRotate: boolean;
  target: THREE.Vector3;
  enabled: boolean;
  update: () => void;
};

export function CameraRig({ reduced }: { reduced: boolean }) {
  const controls = useRef<Controls | null>(null);
  const flying = useRef(false);
  const flyUntil = useRef(0);
  const flyTarget = useRef(new THREE.Vector3(0, 0.35, 5.4));
  const lastEventYear = useRef(-1);
  const resumeAt = useRef(0);
  const { clock } = useThree();

  useFrame((state, dt) => {
    const sim = useSim.getState();
    const year = sim.year;
    if (year <= START_YEAR + 0.02) lastEventYear.current = -1;

    const ev = currentEvent(year);
    if (
      ev?.hotspotId &&
      ev.year !== lastEventYear.current &&
      year >= ev.year &&
      year < ev.year + 0.35
    ) {
      const h = HOTSPOT_BY_ID[ev.hotspotId];
      if (h && !sim.interacting) {
        lastEventYear.current = ev.year;
        const p = latLonToXYZ(h.lat, h.lon, 3.1);
        flyTarget.current.set(p.x, p.y, p.z);
        flying.current = true;
        flyUntil.current = state.clock.elapsedTime + 5;
        sim.setFocus({ lat: h.lat, lon: h.lon, name: h.name });
      }
    }

    const ctrl = controls.current;
    if (flying.current) {
      if (sim.interacting) {
        flying.current = false;
        sim.setFocus(null);
      } else {
        state.camera.position.lerp(flyTarget.current, 1 - Math.exp(-2.1 * dt));
        state.camera.lookAt(0, 0, 0);
        if (ctrl) ctrl.target.set(0, 0, 0);
        if (state.clock.elapsedTime > flyUntil.current) {
          flying.current = false;
          sim.setFocus(null);
        }
      }
    }

    if (ctrl) {
      const idle = state.clock.elapsedTime >= resumeAt.current;
      ctrl.autoRotate = !reduced && !sim.interacting && !flying.current && idle;
    }
  });

  return (
    <OrbitControls
      ref={controls as never}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.068}
      minDistance={2.15}
      maxDistance={8.5}
      autoRotateSpeed={0.18}
      rotateSpeed={0.72}
      zoomSpeed={0.85}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_ROTATE,
      }}
      onStart={() => {
        useSim.getState().setInteracting(true);
        flying.current = false;
        useSim.getState().setFocus(null);
      }}
      onEnd={() => {
        useSim.getState().setInteracting(false);
        resumeAt.current = clock.elapsedTime + 1.2;
      }}
    />
  );
}
