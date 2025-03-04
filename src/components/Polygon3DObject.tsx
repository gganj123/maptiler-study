'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import useMapStore from '@/store/mapStore';

const modelOrigin: [number, number] = [126.978, 37.566];
const modelAltitude = 1000;
const modelRotate = [Math.PI / 2, 0, 0];

export default function Polygon3DObject() {
  const { map } = useMapStore();
  const layerRef = useRef<maptilersdk.CustomLayerInterface | null>(null);

  useEffect(() => {
    if (!map) return;

    if (map.getLayer('polygon-3d-object')) {
      map.removeLayer('polygon-3d-object');
    }

    const modelMercator = maptilersdk.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude,
    );

    const modelTransform = {
      translateX: modelMercator.x,
      translateY: modelMercator.y,
      translateZ: modelMercator.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelMercator.meterInMercatorCoordinateUnits() * 10,
    };

    const customLayer: maptilersdk.CustomLayerInterface = {
      id: 'polygon-3d-object',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function (map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        // ✅ 조명 추가
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);

        // ✅ GLTF 모델 로드
        const loader = new GLTFLoader();
        loader.load(
          'https://docs.maptiler.com/sdk-js/assets/34M_17/34M_17.gltf',
          (gltf) => {
            console.log('✅ 3D 모델 로드 성공:', gltf);
            this.model = gltf.scene;
            this.scene.add(this.model);
          },
        );

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

        // ✅ 오브젝트 회전 (y축 기준)
        this.model.rotation.y += 0.02; // 숫자를 키우면 더 빠르게 회전함
        // this.model.rotation.x += 0.02;
        // this.model.rotation.z += 0.02;

        const rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          modelTransform.rotateX,
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 1, 0),
          modelTransform.rotateY,
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 0, 1),
          modelTransform.rotateZ,
        );

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
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

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
  }, [map]);

  return null;
}
