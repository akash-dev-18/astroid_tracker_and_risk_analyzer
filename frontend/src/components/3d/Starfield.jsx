import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Stars = ({ count = 2000 }) => {
  const ref = useRef();

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);


      const intensity = 0.5 + Math.random() * 0.5;
      colors[i3] = intensity * (0.8 + Math.random() * 0.2);
      colors[i3 + 1] = intensity * (0.8 + Math.random() * 0.2);
      colors[i3 + 2] = intensity;
    }

    return [positions, colors];
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.01;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.005) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

const ShootingStar = () => {
  const ref = useRef();
  const startPosition = useMemo(() => ({
    x: (Math.random() - 0.5) * 100,
    y: 30 + Math.random() * 20,
    z: -50 + Math.random() * 30,
  }), []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.elapsedTime * 0.5) % 3;
      if (t < 1) {
        ref.current.position.set(
          startPosition.x - t * 30,
          startPosition.y - t * 20,
          startPosition.z + t * 10
        );
        ref.current.material.opacity = 1 - t;
      } else {
        ref.current.material.opacity = 0;
      }
    }
  });

  return (
    <mesh ref={ref} position={[startPosition.x, startPosition.y, startPosition.z]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent />
    </mesh>
  );
};

export const Starfield = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <color attach="background" args={['#0a0e27']} />
        <Stars count={3000} />
        <ShootingStar />
        <ShootingStar />
        <ambientLight intensity={0.1} />
      </Canvas>
    </div>
  );
};
