'use client';

import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { MAPTILER_API_KEY } from '../lib/maptiler.config';
import styled from 'styled-components';
import '../styles/maptiler.css';
import useMapStore from '@/store/mapStore';

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

export default function Map({ children }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const { center, zoom, is3D, setMapInstance } = useMapStore();

  // ✅ 클라이언트에서만 실행되도록 `isClient` 상태 사용
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = MAPTILER_API_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: center,
      zoom: zoom,
      pitch: is3D ? 80 : 0,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource('maptiler-terrain', {
        type: 'raster-dem',
        url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${MAPTILER_API_KEY}`,
        tileSize: 256,
      });

      map.current.setTerrain({
        source: 'maptiler-terrain',
        exaggeration: 1.5,
      });

      setMapInstance(map.current);
    });
  }, [isClient]);

  if (!isClient) return null; // ✅ 서버에서 렌더링 방지

  return (
    <MapContainer ref={mapContainer}>{map.current && children}</MapContainer>
  );
}
