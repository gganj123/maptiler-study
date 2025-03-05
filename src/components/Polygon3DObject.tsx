'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import useMapStore from '@/store/mapStore';

interface Polygon3DObjectProps {
  longitude: number;
  latitude: number;
  altitude?: number;
  modelUrl?: string;
  scale?: number;
  rotationSpeed?: number;
}

export default function Polygon3DObject({
  longitude,
  latitude,
  altitude = 300,
  modelUrl = 'https://docs.maptiler.com/sdk-js/assets/34M_17/34M_17.gltf',
  scale = 5,
  rotationSpeed = 0.02,
}: Polygon3DObjectProps) {
  const { map } = useMapStore();
  const layerRef = useRef<maptilersdk.CustomLayerInterface | null>(null);

  useEffect(() => {
    if (!map) return;

    if (map.getLayer('polygon-3d-object')) {
      map.removeLayer('polygon-3d-object');
    }

    // ✅ 위도, 경도를 이용하여 3D 모델의 위치 설정
    const modelMercator = maptilersdk.MercatorCoordinate.fromLngLat(
      { lng: longitude, lat: latitude },
      altitude,
    );

    const modelTransform = {
      translateX: modelMercator.x,
      translateY: modelMercator.y,
      translateZ: modelMercator.z,
      scale: modelMercator.meterInMercatorCoordinateUnits() * scale,
    };

    const customLayer: maptilersdk.CustomLayerInterface = {
      id: 'polygon-3d-object',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function (map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        // ✅ 조명 추가
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, -70, 100).normalize();
        this.scene.add(light);

        // ✅ 3D 모델 로드
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
          console.log('✅ 3D 모델 로드 성공:', gltf);
          this.model = gltf.scene;

          // ✅ 드론 모델 회전 적용
          this.model.rotation.x = Math.PI / 2;

          // ✅ 원뿔 (레이더) 추가
          const radarGeometry = new THREE.ConeGeometry(2, 5, 32); // (반지름, 높이, 세그먼트)
          const radarMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            wireframe: true,
          });

          const radarMesh = new THREE.Mesh(radarGeometry, radarMaterial);
          radarMesh.rotation.x = Math.PI / 2;
          // ✅ 원뿔 위치 조정 (드론 앞쪽에 배치)
          radarMesh.position.set(0, 0, -2.5); // Z축 방향으로 이동 (드론 앞쪽)

          // ✅ 드론 모델에 원뿔 추가
          this.model.add(radarMesh);

          this.scene.add(this.model);
        });

        this.map = map;
        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
          powerPreference: 'high-performance',
        });

        this.renderer.autoClear = false;
      },
      render: function (gl, matrix) {
        if (!this.model) return;

        // ✅ 오브젝트 회전 적용 (속도 조절 가능)
        this.model.rotation.y += rotationSpeed;

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

        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
      },
    };

    map.addLayer(customLayer);
    layerRef.current = customLayer;

    return () => {
      if (map.getLayer('polygon-3d-object')) {
        map.removeLayer('polygon-3d-object');
      }
    };
  }, [map, longitude, latitude, altitude, modelUrl, scale, rotationSpeed]);

  return null;
}
