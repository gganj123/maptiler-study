import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

export default function DroneModel({
  position,
}: {
  position: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);

  console.log('🛸 DroneModel 생성됨. 위치:', position);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.01, 0.01, 0.02, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
