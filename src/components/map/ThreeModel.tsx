'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeModel = () => {
  const modelContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modelContainer.current) return;

    // Scene 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // 카메라 설정
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 2, 5); // 카메라 위치 조정

    // Renderer 생성
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    modelContainer.current.appendChild(renderer.domElement);

    // GLTF 모델 로드
    const loader = new GLTFLoader();
    loader.load(
      '/models/Cube.glb', // 로컬에 저장된 GLB 파일 로드
      (gltf) => {
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        scene.add(gltf.scene);
      },
      undefined,
      (error) => console.error('GLTF 로드 오류:', error),
    );

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div ref={modelContainer} style={{ width: '100vw', height: '100vh' }} />
  );
};

export default ThreeModel;
