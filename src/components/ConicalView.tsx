import { useEffect } from 'react';
import * as THREE from 'three';
import * as maptilersdk from '@maptiler/sdk';

interface ConicalViewProps {
  map: maptilersdk.Map | null;
  lng: number;
  lat: number;
  direction?: number;
  altitude: number;
}

export default function ConicalView({
  map,
  lng,
  lat,
  altitude = 50,
  direction = 0,
}: ConicalViewProps) {
  useEffect(() => {
    if (!map) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0, altitude + 50);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(300, 300);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';

    if (!scene) return;

    const geometry = new THREE.CylinderGeometry(
      0,
      10,
      0,
      32,
      1,
      false,
      0,
      Math.PI / 2,
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const cone = new THREE.Mesh(geometry, material);

    const position = map.project([lng, lat]);
    cone.position.set(position.x, position.y, 10);
    cone.rotation.z = THREE.MathUtils.degToRad(-direction);

    scene.add(cone);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.warn('⚠️ WebGL Context Lost! Disposing Renderer...');
      renderer.dispose();
    });

    map.getContainer().appendChild(renderer.domElement);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scene.remove(cone);
      renderer.dispose();
      map.getContainer().removeChild(renderer.domElement);
    };
  }, [map, lng, lat, direction]);

  return null;
}
