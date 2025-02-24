'use client';

import { useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import useMapStore from '@/store/mapStore';

interface MarkerProps {
  position: [number, number];
}

export default function Marker({ position }: MarkerProps) {
  const { map } = useMapStore();

  useEffect(() => {
    if (!map) return;

    const marker = new maptilersdk.Marker().setLngLat(position).addTo(map);

    return () => marker.remove();
  }, [map, position]);

  return null;
}
