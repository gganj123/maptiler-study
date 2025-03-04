'use client';

import Map from '@/components/Map';
import Polygon from '@/components/Polygon';
import Marker from '@/components/Marker';
import Polygon3DObject from '../components/Polygon3DObject';

const polygonCenter = [
  (126.978 + 126.982 + 126.984 + 126.98) / 4,
  (37.566 + 37.564 + 37.567 + 37.569) / 4,
];

const objectPosition: [number, number] = [
  polygonCenter[0] + 0.0005,
  polygonCenter[1] - 0.0003,
];

export default function DroneTrackingPage() {
  const polygonCoordinates: [number, number][] = [
    [126.978, 37.566],
    [126.982, 37.564],
    [126.984, 37.567],
    [126.98, 37.569],
    [126.978, 37.566],
  ];

  const dronePositions: [number, number][] = [
    [126.98, 37.565],
    [126.981, 37.567],
    [126.982, 37.569],
    [126.983, 37.57],
    [126.984, 37.571],
    [126.985, 37.572],
    [126.986, 37.573],
    [126.987, 37.574],
  ];

  return (
    <Map>
      <Polygon coordinates={polygonCoordinates} color="#00ff00" />
      {dronePositions.map((pos, idx) => (
        <Marker key={idx} position={pos} />
      ))}
      <Marker position={objectPosition} />

      <Polygon3DObject />
    </Map>
  );
}
