'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { MAPTILER_API_KEY } from '@/lib/maptiler.config';

maptilersdk.config.apiKey = MAPTILER_API_KEY;

const DroneMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const droneMarkersRef = useRef<maptilersdk.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
      center: [127.0, 37.5],
      zoom: 12,
      pitch: 60,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // ✅ `useCallback`으로 최적화된 클릭 이벤트 핸들러
  const handleMapClick = useCallback((event: maptilersdk.MapMouseEvent) => {
    if (!mapRef.current) return;
    const { lng, lat } = event.lngLat;

    const newMarker = new maptilersdk.Marker({ anchor: 'center' })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    // ✅ useRef를 사용해 마커 리스트 관리 (불필요한 리렌더링 방지)
    droneMarkersRef.current.push(newMarker);
  }, []);

  // ✅ 이벤트 리스너 등록 및 해제
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on('click', handleMapClick);

    return () => {
      mapRef.current?.off('click', handleMapClick);
    };
  }, [handleMapClick]);

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
