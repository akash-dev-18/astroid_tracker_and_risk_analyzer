import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#4488ff"
        emissive="#1144aa"
        emissiveIntensity={0.3}
        roughness={0.8}
      />
    </mesh>
  );
}

function OrbitRing({ radius, color, speed }: { radius: number; color: string; speed: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const asteroidRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angleRef.current += delta * speed;
    if (asteroidRef.current) {
      asteroidRef.current.position.x = Math.cos(angleRef.current) * radius;
      asteroidRef.current.position.z = Math.sin(angleRef.current) * radius;
      asteroidRef.current.position.y = Math.sin(angleRef.current * 2) * 0.2;
    }
  });

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.15} />
      </line>
      <mesh ref={asteroidRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const orbits = useMemo(
    () => [
      { radius: 2.2, color: "#00ddcc", speed: 0.4 },
      { radius: 2.8, color: "#00ddcc", speed: 0.3 },
      { radius: 3.5, color: "#ff4444", speed: 0.5 },
      { radius: 4.0, color: "#00ddcc", speed: 0.25 },
      { radius: 4.8, color: "#ffaa33", speed: 0.35 },
      { radius: 5.5, color: "#ff4444", speed: 0.2 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 5, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4488ff" />

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <Earth />

      {orbits.map((orbit, i) => (
        <OrbitRing key={i} {...orbit} />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minDistance={4}
        maxDistance={15}
      />
    </>
  );
}

export function OrbitScene() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
