'use client';

import { useEffect } from 'react';
import useMapStore from '@/store/mapStore';

interface PolygonProps {
  coordinates: [number, number][];
  color?: string;
}

export default function Polygon({
  coordinates,
  color = '#ff0000',
}: PolygonProps) {
  const { map } = useMapStore();

  useEffect(() => {
    if (!map) return;

    const sourceId = `polygon-source-${Math.random()}`; // ✅ 고유한 ID 생성
    const layerId = `polygon-layer-${Math.random()}`;

    // ✅ 폴리곤 추가
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coordinates],
            },
          },
        ],
      },
    });

    map.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': color, // 기본 빨간색
        'fill-opacity': 0.5, // 투명도 50%
      },
    });

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, coordinates, color]);

  return null;
}
