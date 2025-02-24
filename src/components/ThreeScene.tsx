import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.ConeGeometry(5, 15, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5,
    });
    const cone = new THREE.Mesh(geometry, material);
    scene.add(cone);

    camera.position.z = 50;

    const animate = () => {
      requestAnimationFrame(animate);
      cone.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      sceneRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
