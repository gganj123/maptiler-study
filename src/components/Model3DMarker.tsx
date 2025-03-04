'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import useMapStore from '@/store/mapStore';

interface Model3DMarkerProps {
  position: [number, number];
  modelUrl: string;
  scale?: number;
  altitude?: number;
}

export default function Model3DMarker({
  position,
  modelUrl,
  scale = 10,
  altitude = 0,
}: Model3DMarkerProps) {
  const { map } = useMapStore();
  const layerRef = useRef<maptilersdk.CustomLayerInterface | null>(null);

  useEffect(() => {
    if (!map) return;

    const modelMercator = maptilersdk.MercatorCoordinate.fromLngLat(
      position,
      altitude,
    );

    const modelTransform = {
      translateX: modelMercator.x,
      translateY: modelMercator.y,
      translateZ: modelMercator.z,
      scale: modelMercator.meterInMercatorCoordinateUnits() * scale,
    };

    // ✅ 3D 모델을 추가할 커스텀 레이어 생성
    const customLayer: maptilersdk.CustomLayerInterface = {
      id: '3d-model-layer',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function (map, gl) {
        const scene = new THREE.Scene();
        const camera = new THREE.Camera();

        // ✅ 조명 추가
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, -70, 100).normalize();
        scene.add(light);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(70, 70, 100).normalize();
        scene.add(light2);

        // ✅ GLTF 모델 로드 및 추가
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
          console.log('✅ 모델 로드 성공:', gltf);

          gltf.scene.scale.set(scale, scale, scale);
          scene.add(gltf.scene);
          console.log('🎉 모델이 씬에 추가되었습니다.');
        });

        const renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });

        renderer.autoClear = false;

        (this as any).scene = scene;
        (this as any).camera = camera;
        (this as any).renderer = renderer;
      },
      render: function (gl, matrix) {
        if (
          !(this as any).scene ||
          !(this as any).camera ||
          !(this as any).renderer
        )
          return;

        const scene = (this as any).scene as THREE.Scene;
        const camera = (this as any).camera as THREE.Camera;
        const renderer = (this as any).renderer as THREE.WebGLRenderer;

        // ✅ `matrix`를 `fromArray`를 사용하여 변환
        const m = new THREE.Matrix4().fromArray(matrix as number[]);
        const l = new THREE.Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ,
          )
          .scale(
            new THREE.Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale,
            ),
          );

        camera.projectionMatrix = m.multiply(l);
        renderer.state.reset();
        renderer.render(scene, camera);
        map.triggerRepaint();
      },
    };

    // ✅ MapTiler 지도에 커스텀 3D 레이어 추가
    map.addLayer(customLayer);
    layerRef.current = customLayer;

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current.id);
    };
  }, [map, position, modelUrl, scale, altitude]);

  return null;
}
