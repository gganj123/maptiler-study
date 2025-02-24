import useMapStore from '@/store/mapStore';
import * as maptilersdk from '@maptiler/sdk';
import { useEffect } from 'react';
import ConicalView from './ConicalView';

interface MarkerLayerProps {
  map: maptilersdk.Map | null;
}

export default function MarkerLayer({ map }: MarkerLayerProps) {
  const { markers, removeMarker } = useMapStore();

  useEffect(() => {
    if (!map) return;

    markers.forEach(({ id, lng, lat }) => {
      const marker = new maptilersdk.Marker({ color: '#ff0000' })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.getElement().setAttribute('id', `marker-${id}`);

      marker.getElement().addEventListener('click', () => {
        removeMarker(id);
      });
    });

    return () => {
      markers.forEach(({ id }) => {
        const existingMarker = document.getElementById(`marker-${id}`);
        if (existingMarker) existingMarker.remove();
      });
    };
  }, [map, markers]);

  return (
    <>
      {markers.map((marker) => (
        <ConicalView
          key={marker.id}
          map={map}
          lng={marker.lng}
          lat={marker.lat}
          direction={45}
        />
      ))}
    </>
  );
}
