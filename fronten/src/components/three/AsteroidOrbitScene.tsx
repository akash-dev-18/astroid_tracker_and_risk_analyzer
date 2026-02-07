import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import { Vector3, Mesh } from "three";
import type { AsteroidResponse, CloseApproachResponse } from "@/types/api";

interface AsteroidOrbitSceneProps {
  asteroid: AsteroidResponse;
}

function Earth() {
  return (
    <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#2563eb" emissive="#1e40af" emissiveIntensity={0.3} />
    </Sphere>
  );
}

function AsteroidObject({ approach }: { approach: CloseApproachResponse }) {
  const asteroidRef = useRef<Mesh>(null);

  const lunarDistance = approach.miss_distance_lunar || 10;
  const scaledDistance = Math.min(lunarDistance * 0.5, 15);
  
  const angle = Math.random() * Math.PI * 2;
  const position = new Vector3(
    Math.cos(angle) * scaledDistance,
    Math.sin(angle * 0.3) * 2,
    Math.sin(angle) * scaledDistance
  );

  useFrame(({ clock }) => {
    if (asteroidRef.current) {
      const time = clock.getElapsedTime() * 0.2;
      asteroidRef.current.position.x = Math.cos(angle + time) * scaledDistance;
      asteroidRef.current.position.z = Math.sin(angle + time) * scaledDistance;
      asteroidRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={asteroidRef} args={[0.2, 16, 16]} position={position}>
      <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
    </Sphere>
  );
}

function OrbitPath({ approach }: { approach: CloseApproachResponse }) {
  const lunarDistance = approach.miss_distance_lunar || 10;
  const scaledDistance = Math.min(lunarDistance * 0.5, 15);
  
  const points: Vector3[] = [];
  const segments = 64;
  
 for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new Vector3(
        Math.cos(angle) * scaledDistance,
        Math.sin(angle * 3) * 2,
        Math.sin(angle) * scaledDistance
      )
    );
  }

  return <Line points={points} color="#9333ea" lineWidth={2} opacity={0.6} transparent />;
}

function Scene({ asteroid }: { asteroid: AsteroidResponse }) {
  const latestApproach = asteroid.close_approaches[0];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      <Earth />
      
      {latestApproach && (
        <>
          <OrbitPath approach={latestApproach} />
          <AsteroidObject approach={latestApproach} />
        </>
      )}
      
      <OrbitControls enableZoom={true} enablePan={true} />
      
      <gridHelper args={[30, 30, "#334155", "#1e293b"]} />
    </>
  );
}

export function AsteroidOrbitScene({ asteroid }: AsteroidOrbitSceneProps) {
  return (
   <div className="w-full h-full bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
        <Scene asteroid={asteroid} />
      </Canvas>
    </div>
  );
}
