'use client';

import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import styled from 'styled-components';
import RadarLayer from './RadarLayer';
import { MAPTILER_API_KEY } from '@/lib/maptiler.config';

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

export default function MapWithRadar() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const isMounted = useRef(false);
  const [isClient, setIsClient] = useState(false); // ✅ 클라이언트에서만 렌더링

  useEffect(() => {
    setIsClient(true); // ✅ 클라이언트에서 실행되도록 설정
  }, []);

  useEffect(() => {
    if (!isClient || isMounted.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = MAPTILER_API_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [127.0, 37.5],
      zoom: 14,
      pitch: 0,
    });

    isMounted.current = true;

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        console.log('🚀 Map removed');
      }
    };
  }, [isClient]);

  if (!isClient) return null; 

  return (
    <MapContainer ref={mapContainer}>
      <RadarLayer yaw={90} range={60} opacity={0.3} />
    </MapContainer>
  );
}
