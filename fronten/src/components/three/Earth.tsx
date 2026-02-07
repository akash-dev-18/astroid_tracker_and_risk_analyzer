import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Earth() {
  const earthRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <meshPhongMaterial
          color="#1e40af"
          emissive="#0a1628"
          emissiveIntensity={0.15}
          specular="#60a5fa"
          shininess={35}
        />
      </mesh>

      {/* Continents layer */}
      <mesh rotation={[0, 0.5, 0]}>
        <sphereGeometry args={[1.51, 64, 64]} />
        <meshPhongMaterial
          color="#22c55e"
          transparent
          opacity={0.65}
          emissive="#15803d"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Ice caps */}
      <mesh rotation={[0, 1.2, 0]}>
        <sphereGeometry args={[1.52, 32, 32]} />
        <meshPhongMaterial
          color="#f0f9ff"
          transparent
          opacity={0.4}
          emissive="#dbeafe"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.54, 64, 64]} />
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          emissive="#f8fafc"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.75, 64, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.95, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Moon */}
      <Moon />
    </group>
  );
}

function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (moonRef.current) {
      const time = clock.getElapsedTime() * 0.12;
      moonRef.current.position.x = Math.cos(time) * 4.5;
      moonRef.current.position.z = Math.sin(time) * 4.5;
      moonRef.current.position.y = Math.sin(time * 0.4) * 0.4;
      moonRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshPhongMaterial
        color="#a8a29e"
        emissive="#292524"
        emissiveIntensity={0.08}
        specular="#78716c"
        shininess={6}
      />
    </mesh>
  );
}
