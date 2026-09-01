"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Hud } from "./Hud";
import { Scene } from "./Scene";

export default function GlobeApp() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="globe-root">
      <div className="globe-canvas-wrap" aria-hidden="true">
        <Canvas
          className="globe-canvas"
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.35, 5.4], fov: 42, near: 0.12, far: 80 }}
          onCreated={({ gl }) => {
            gl.setClearColor("#02040a", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <Suspense fallback={null}>
            <Scene reduced={reduced} />
          </Suspense>
        </Canvas>
      </div>
      <div className="vignette" />
      <Hud reduced={reduced} />
    </div>
  );
}
