'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { MAPTILER_API_KEY } from '../lib/maptiler.config';
import styled from 'styled-components';
import '../styles/maptiler.css';
import useMapStore from '@/store/mapStore';
import MarkerLayer from './MarkerLayer';

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);

  const { center, zoom, is3D, addMarker } = useMapStore();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = MAPTILER_API_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: center,
      zoom: zoom,
      pitch: is3D ? 60 : 0,
    });

    map.current.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      addMarker(lng, lat);
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setCenter(center);
      map.current.setZoom(zoom);
      map.current.setPitch(is3D ? 60 : 0);
    }
  }, [center, zoom, is3D]);

  return (
    <MapContainer ref={mapContainer}>
      {map.current && <MarkerLayer map={map.current} />}
    </MapContainer>
  );
}
