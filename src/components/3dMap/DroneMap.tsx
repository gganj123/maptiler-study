'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as maptiler3d from '@maptiler/3d';
import { MAPTILER_API_KEY } from '@/lib/maptiler.config';

maptilersdk.config.apiKey = MAPTILER_API_KEY;

const DroneMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
      center: [127.0, 37.5],
      zoom: 12,
      pitch: 60,
      terrain: true, // ✅ 지형 활성화
      maxPitch: 85, // 3D 효과 강화
    });

    (async () => {
      await mapRef.current?.onReadyAsync();

      // ✅ 3D 레이어 추가
      const layer3D = new maptiler3d.Layer3D('drone-3D-layer');
      mapRef.current?.addLayer(layer3D);

      layer3D.setAmbientLight({ intensity: 2 });

      const droneID = 'drone-model';
      await layer3D.addMeshFromURL(droneID, '/models/Cube.glb', {
        scale: 10,
        visible: true,
        heading: 0,
        lngLat: [127.0, 37.5],
      });

      let droneCounter = 0;
      mapRef.current?.on('click', async (e) => {
        droneCounter += 1;
        const newDroneID = `drone-${droneCounter}`;
        await layer3D.cloneMesh(droneID, newDroneID, {
          lngLat: e.lngLat,
          visible: true,
          scale: 10,
          altitude: 252,
        });
      });
    })();

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default DroneMap;
