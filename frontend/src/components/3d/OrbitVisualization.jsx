import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';


const Earth = () => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 32, 32]}>
      <meshStandardMaterial
        color="#4a90d9"
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  );
};


const OrbitPath = ({ radius, color = '#4f46e5' }) => {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.5}
    />
  );
};


const Asteroid = ({ radius, speed, size, isHazardous, name }) => {
  const ref = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed + offset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.rotation.x += 0.02;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <dodecahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={isHazardous ? '#ef4444' : '#a5b4fc'}
          roughness={0.6}
          metalness={0.4}
          emissive={isHazardous ? '#ef4444' : '#4f46e5'}
          emissiveIntensity={isHazardous ? 0.3 : 0.1}
        />
      </mesh>
      {name && (
        <Html distanceFactor={10} position={[0, size + 0.3, 0]} className="pointer-events-none">
          <div className="px-2 py-1 bg-dark-card/90 border border-dark-border rounded text-xs text-white whitespace-nowrap">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};


const Stars = () => {
  const ref = useRef();

  const positions = useMemo(() => {
    const pts = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      const r = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
};


const LoadingFallback = () => (
  <Html center>
    <div className="text-space-400 text-sm animate-pulse">Loading 3D Scene...</div>
  </Html>
);

export const OrbitVisualization = ({ asteroid, className = '' }) => {

  const orbitRadius = useMemo(() => {
    const approach = asteroid?.close_approaches?.[0];
    if (approach?.miss_distance_lunar) {

      return Math.min(Math.max(approach.miss_distance_lunar * 0.5, 2), 8);
    }
    return 4;
  }, [asteroid]);


  const asteroidSize = useMemo(() => {
    if (asteroid?.estimated_diameter_max) {

      return Math.min(Math.max(asteroid.estimated_diameter_max * 0.5, 0.15), 0.4);
    }
    return 0.2;
  }, [asteroid]);

  return (
    <div className={`w-full h-[400px] rounded-xl overflow-hidden bg-dark-bg ${className}`}>
      <Canvas camera={{ position: [8, 5, 8], fov: 50 }}>
        <Suspense fallback={<LoadingFallback />}>

          <color attach="background" args={['#0a0e27']} />
          <Stars />


          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />


          <Earth />
          

          <OrbitPath radius={3} color="#3f3f46" />
          

          <OrbitPath radius={orbitRadius} color={asteroid?.is_hazardous ? '#ef4444' : '#6366f1'} />
          

          <Asteroid
            radius={orbitRadius}
            speed={0.3}
            size={asteroidSize}
            isHazardous={asteroid?.is_hazardous}
            name={asteroid?.name}
          />


          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={5}
            maxDistance={20}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
