'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DroneModel from './DroneModel';
import { convertLatLngToXYZ } from './map/utils/convertcoords';

export default function ThreeCanvas({
  positions,
}: {
  positions: [number, number][];
}) {
  console.log('🚀 ThreeCanvas 렌더링됨');
  console.log('🔍 받은 positions 데이터:', positions);

  return (
    <Canvas
      camera={{ position: [0, 50, 100], fov: 50 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls />

      {positions.map((pos, idx) => {
        const convertedPos = convertLatLngToXYZ(pos[0], pos[1], 20);
        console.log(`🛸 드론 ${idx} 변환된 좌표:`, convertedPos);

        // ✅ 마커(원래 경위도)와 변환된 Three.js 좌표 비교
        console.log(`📍 마커 위치 (lng: ${pos[0]}, lat: ${pos[1]})`);
        console.log(`🛸 변환된 드론 위치: ${convertedPos}`);

        return <DroneModel key={idx} position={convertedPos} />;
      })}
    </Canvas>
  );
}
