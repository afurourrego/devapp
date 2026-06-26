"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);
    vec2 p = (uv - 0.5) * asp;

    float t = uTime * 0.06;
    vec2 m = (uMouse - 0.5) * asp;

    // domain-warped flow field, nudged by the cursor
    vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 5.2));
    vec2 r = vec2(fbm(p * 1.5 + q + m * 0.6 + t), fbm(p * 1.5 + q - m * 0.6));
    float f = fbm(p * 1.8 + r * 1.4);

    // soft spotlight following the cursor
    float glow = smoothstep(1.2, 0.0, length(p - m));

    vec3 ink     = vec3(0.043, 0.024, 0.063);
    vec3 brand   = vec3(0.353, 0.149, 0.463);
    vec3 violet  = vec3(0.659, 0.333, 0.969);
    vec3 magenta = vec3(1.000, 0.365, 0.635);

    vec3 col = mix(ink, brand, smoothstep(0.2, 0.7, f));
    col = mix(col, violet, smoothstep(0.45, 0.9, f) * (0.55 + 0.45 * glow));
    col = mix(col, magenta, smoothstep(0.72, 1.0, f + glow * 0.25) * 0.7);

    float vig = smoothstep(1.45, 0.15, length((uv - 0.5) * asp));
    col *= 0.5 + 0.7 * vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function AuroraPlane() {
  const { viewport, size } = useThree();
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uRes.value.set(size.width, size.height);
    target.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    uniforms.uMouse.value.lerp(target.current, 0.04);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

export function HeroAurora() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1] }}
    >
      <AuroraPlane />
    </Canvas>
  );
}
