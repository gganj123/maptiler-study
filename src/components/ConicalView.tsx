import { useEffect } from 'react';
import * as THREE from 'three';
import * as maptilersdk from '@maptiler/sdk';

interface ConicalViewProps {
  map: maptilersdk.Map | null;
  lng: number;
  lat: number;
  direction?: number; // 시야 방향 (기본값: 0도)
}

export default function ConicalView({
  map,
  lng,
  lat,
  direction = 0,
}: ConicalViewProps) {
  useEffect(() => {
    if (!map) return;

    const scene = map.getThreeScene() as THREE.Scene | null;
    if (!scene) return;

    const coneGeometry = new THREE.ConeGeometry(10, 20, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
    });

    const cone = new THREE.Mesh(coneGeometry, material);

    const position = map.project([lng, lat]);
    cone.position.set(position.x, position.y, 10);

    cone.rotation.z = THREE.MathUtils.degToRad(-direction);

    scene.add(cone);

    return () => {
      scene.remove(cone);
    };
  }, [map, lng, lat, direction]);

  return null;
}
