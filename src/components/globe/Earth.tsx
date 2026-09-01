"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { EARTH_RADIUS } from "@/lib/sim/geo";
import { sample } from "@/lib/sim/projections";
import { useSim } from "@/lib/sim/store";
import {
  loadTexture,
  makeCloudTexture,
  makeDayTexture,
  makeNightTexture,
  prepColorMap,
  robotActivity,
  SUN_DIR,
} from "./sparks";

const VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vUv = uv;
  vec4 wpos = modelMatrix * vec4(position, 1.0);
  vPosW = wpos.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wpos;
}
`;

const FRAG = /* glsl */ `
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform vec3 sunDir;
uniform float activity;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vec3 n = normalize(vNormalW);
  vec3 l = normalize(sunDir);
  float ndl = dot(n, l);
  float dayF = smoothstep(-0.12, 0.22, ndl);
  float term = 1.0 - smoothstep(0.0, 0.18, abs(ndl - 0.02));
  vec3 dayC = texture2D(dayMap, vUv).rgb;
  vec3 nightC = texture2D(nightMap, vUv).rgb;
  nightC *= (0.7 + 1.8 * activity);
  vec3 col = mix(nightC, dayC, dayF);
  col += vec3(1.0, 0.52, 0.18) * term * 0.32;
  float nde = max(dot(n, normalize(cameraPosition - vPosW)), 0.0);
  col *= 0.78 + 0.22 * nde;
  gl_FragColor = vec4(col, 1.0);
}
`;

const ATM_FRAG = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vec3 n = normalize(vNormalW);
  vec3 v = normalize(cameraPosition - vPosW);
  float f = pow(1.0 - abs(dot(n, v)), 2.55);
  vec3 col = mix(vec3(0.04, 0.32, 0.62), vec3(0.45, 0.92, 1.0), f);
  gl_FragColor = vec4(col, clamp(f * 0.75, 0.0, 0.85));
}
`;

export function Earth({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const created = useRef<THREE.Texture[]>([]);

  const uniforms = useMemo(
    () => ({
      dayMap: { value: makeDayTexture() },
      nightMap: { value: makeNightTexture() },
      sunDir: { value: SUN_DIR.clone() },
      activity: { value: 0 },
    }),
    [],
  );

  const cloudMap = useMemo(() => makeCloudTexture(), []);

  useEffect(() => {
    created.current = [uniforms.dayMap.value, uniforms.nightMap.value, cloudMap];
    let dead = false;
    (async () => {
      const [day, night, cloudsTex, cloudsJpg] = await Promise.all([
        loadTexture("/earth/day.jpg"),
        loadTexture("/earth/night.jpg"),
        loadTexture("/earth/clouds.png"),
        loadTexture("/earth/clouds.jpg"),
      ]);
      if (dead) {
        day?.dispose();
        night?.dispose();
        cloudsTex?.dispose();
        cloudsJpg?.dispose();
        return;
      }
      if (day) {
        uniforms.dayMap.value.dispose();
        uniforms.dayMap.value = prepColorMap(day);
      }
      if (night) {
        uniforms.nightMap.value.dispose();
        uniforms.nightMap.value = prepColorMap(night);
      }
      const ctex = cloudsTex ?? cloudsJpg;
      if (ctex && clouds.current) {
        const matC = clouds.current.material as THREE.MeshBasicMaterial;
        cloudMap.dispose();
        matC.map = prepColorMap(ctex);
        matC.needsUpdate = true;
      }
      if (mat.current) mat.current.needsUpdate = true;
    })();
    return () => {
      dead = true;
      created.current.forEach((t) => t.dispose());
    };
  }, [cloudMap, uniforms]);

  useFrame((_, dt) => {
    const year = useSim.getState().year;
    const robots = sample(year).robots;
    if (mat.current) {
      mat.current.uniforms.activity.value = robotActivity(robots);
      mat.current.uniforms.sunDir.value.copy(SUN_DIR);
    }
    if (!reduced) {
      if (group.current) group.current.rotation.y += dt * 0.038;
      if (clouds.current) clouds.current.rotation.y += dt * 0.052;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 96, 64]} />
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          toneMapped
        />
      </mesh>
      <mesh ref={clouds} scale={1.012}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 48]} />
        <meshBasicMaterial
          map={cloudMap}
          transparent
          opacity={0.38}
          depthWrite={false}
          side={THREE.DoubleSide}
          color="#dfe9f4"
        />
      </mesh>
      <mesh scale={1.046}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 48]} />
        <shaderMaterial
          vertexShader={VERT}
          fragmentShader={ATM_FRAG}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          toneMapped
        />
      </mesh>
    </group>
  );
}
