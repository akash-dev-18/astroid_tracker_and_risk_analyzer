import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { AsteroidResponse } from "@/types/api";

interface AsteroidOrbitSceneProps {
  asteroid: AsteroidResponse;
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#1e40af"
        emissiveIntensity={0.3}
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
}

function Asteroid({ asteroid }: { asteroid: AsteroidResponse }) {
  const asteroidRef = useRef<THREE.Mesh>(null);
  const approach = asteroid.close_approaches[0];

  if (!approach) return null;

  // Calculate size and distance
  const avgDiameter = (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2;
  const asteroidSize = Math.max(0.1, Math.min(avgDiameter * 100, 0.8));
  
  const lunarDistance = approach.miss_distance_lunar || 10;
  const orbitRadius = Math.log10(lunarDistance + 1) * 6;

  useFrame(({ clock }) => {
    if (asteroidRef.current) {
      const time = clock.getElapsedTime() * 0.3;
      asteroidRef.current.position.x = Math.cos(time) * orbitRadius;
      asteroidRef.current.position.z = Math.sin(time) * orbitRadius;
      asteroidRef.current.position.y = Math.sin(time * 2) * 1;

      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.015;
    }
  });

  return (
    <mesh ref={asteroidRef} castShadow>
      <dodecahedronGeometry args={[asteroidSize, 0]} />
      <meshStandardMaterial
        color={asteroid.is_hazardous ? "#ef4444" : "#fbbf24"}
        emissive={asteroid.is_hazardous ? "#dc2626" : "#f59e0b"}
        emissiveIntensity={0.5}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

function OrbitPath({ asteroid }: { asteroid: AsteroidResponse }) {
  const approach = asteroid.close_approaches[0];
  if (!approach) return null;

  const lunarDistance = approach.miss_distance_lunar || 10;
  const orbitRadius = Math.log10(lunarDistance + 1) * 6;

  const points = [];
  const segments = 128;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = Math.sin(angle * 2) * 1;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points, true);
  const tubeGeometry = new THREE.TubeGeometry(curve, 128, 0.03, 8, true);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial
        color={asteroid.is_hazardous ? "#f87171" : "#a78bfa"}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export function AsteroidOrbitScene({ asteroid }: AsteroidOrbitSceneProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [15, 10, 15], fov: 60 }} shadows>
        <color attach="background" args={["#0a1628"]} />
        <fog attach="fog" args={["#0f1f3d", 20, 60]} />

        <ambientLight intensity={0.15} />
        <pointLight position={[30, 30, 30]} intensity={1.5} castShadow />
        <pointLight position={[-20, 10, -20]} intensity={0.5} color="#4c6fcc" />

        <Earth />
        <Asteroid asteroid={asteroid} />
        <OrbitPath asteroid={asteroid} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

        <gridHelper args={[50, 50, "#1e3a8a", "#0f172a"]} />

        <OrbitControls
          enableZoom
          enablePan
          minDistance={8}
          maxDistance={40}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
