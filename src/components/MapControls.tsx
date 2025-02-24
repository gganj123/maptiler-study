'use client';

import useMapStore from '@/store/mapStore';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

export default function MapControls() {
  const { is3D, toggle3D, setZoom, addMarker } = useMapStore();

  return (
    <ControlsContainer>
      <button onClick={toggle3D}>{is3D ? '2D 보기' : '3D 보기'}</button>
      <button onClick={() => setZoom(15)}>Zoom In</button>
      <button onClick={() => setZoom(10)}>Zoom Out</button>
      <button onClick={() => addMarker(126.9779692, 37.566535)}>
        마커 추가
      </button>
    </ControlsContainer>
  );
}
