import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import type { AsteroidResponse, CloseApproachResponse } from "@/types/api";
import * as THREE from "three";

interface AsteroidsProps {
  asteroid: AsteroidResponse;
}

export function Asteroids({ asteroid }: AsteroidsProps) {
  const latestApproach = asteroid.close_approaches[0];

  if (!latestApproach) {
    return null;
  }

  // Calculate size with better visibility
  const avgDiameter = (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) / 2;
  
  const asteroidSize = avgDiameter < 0.001 
    ? 0.2   // Tiny: 20cm < diameter
    : avgDiameter < 0.01 
    ? 0.3 + (avgDiameter * 30)  // Small: 30-60cm
    : avgDiameter < 0.05
    ? 0.6 + (avgDiameter * 8)   // Medium: 60-100cm
    : avgDiameter < 0.1
    ? 0.9 + (avgDiameter * 4)   // Large: 90-130cm
    : Math.min(1.2 + Math.log10(avgDiameter + 0.1) * 0.5, 2.0);  // Huge: up to 2m

  return (
    <group>
      <AsteroidOrbit 
        approach={latestApproach} 
        isHazardous={asteroid.is_hazardous}
      />
      <AsteroidObject 
        approach={latestApproach}
        asteroidSize={asteroidSize}
        isHazardous={asteroid.is_hazardous}
        asteroidName={asteroid.name}
      />
    </group>
  );
}

function AsteroidObject({
  approach,
  asteroidSize,
  isHazardous,
  asteroidName
}: {
  approach: CloseApproachResponse;
  asteroidSize: number;
  isHazardous: boolean;
  asteroidName: string;
}) {
  const asteroidRef = useRef<THREE.Mesh>(null);

  const lunarDistance = approach.miss_distance_lunar || 10;
  const scaledDistance = Math.log10(lunarDistance + 1) * 5;

  const velocity = approach.velocity_kmh || 50000;
  const normalizedVelocity = Math.min(velocity / 100000, 1);

  const orbitAngle = useMemo(() => {
    const hash = approach.asteroid_id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return (hash % 360) * (Math.PI / 180);
  }, [approach.asteroid_id]);

  useFrame(({ clock }) => {
    if (asteroidRef.current) {
      const time = clock.getElapsedTime() * normalizedVelocity * 0.25;
      const progress = (time % (2 * Math.PI));
      
      asteroidRef.current.position.x = Math.cos(orbitAngle + progress) * scaledDistance;
      asteroidRef.current.position.z = Math.sin(orbitAngle + progress) * scaledDistance;
      asteroidRef.current.position.y = Math.sin(progress * 1.8) * 1.2;
      
      // Tumbling rotation
      asteroidRef.current.rotation.x += 0.018;
      asteroidRef.current.rotation.y += 0.012;
      asteroidRef.current.rotation.z += 0.006;
    }
  });

  return (
    <group>
      {/* Main asteroid */}
      <mesh ref={asteroidRef} castShadow>
        {/* Irregular shape for realism */}
        <dodecahedronGeometry args={[asteroidSize, 1]} />
        <meshPhongMaterial
          color={isHazardous ? "#dc2626" : "#78716c"}
          emissive={isHazardous ? "#991b1b" : "#1c1917"}
          emissiveIntensity={0.25}
          specular={isHazardous ? "#7f1d1d" : "#44403c"}
          shininess={5}
          flatShading
        />
      </mesh>

      {/* Hazardous asteroid warning glow */}
      {isHazardous && asteroidRef.current && (
        <mesh position={asteroidRef.current.position}>
          <sphereGeometry args={[asteroidSize * 1.5, 16, 16]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}

function AsteroidOrbit({
  approach,
  isHazardous
}: {
  approach: CloseApproachResponse;
  isHazardous: boolean;
}) {
  const lunarDistance = approach.miss_distance_lunar || 10;
  const scaledDistance = Math.log10(lunarDistance + 1) * 5;

  const orbitAngle = useMemo(() => {
    const hash = approach.asteroid_id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return (hash % 360) * (Math.PI / 180);
  }, [approach.asteroid_id]);

  const orbitGeometry = useMemo(() => {
    const points = [];
    const segments = 300;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(orbitAngle + angle) * scaledDistance;
      const z = Math.sin(orbitAngle + angle) * scaledDistance;
      const y = Math.sin(angle * 1.8) * 1.2;
      points.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, [scaledDistance, orbitAngle]);

  return (
    <line geometry={orbitGeometry}>
      <lineBasicMaterial 
        color={isHazardous ? "#f87171" : "#a78bfa"} 
        opacity={0.75}
        transparent
        linewidth={3}
      />
    </line>
  );
}

