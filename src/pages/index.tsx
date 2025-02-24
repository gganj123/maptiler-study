import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });
import MapControls from '../components/MapControls';

export default function Home() {
  return (
    <div>
      <MapControls />
      <Map />
    </div>
  );
}
