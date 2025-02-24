import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });
import MapControls from '../components/MapControls';
import DroneTrackingPage from './DroneTrackingPage';

export default function Home() {
  return (
    <div>
      <DroneTrackingPage />
    </div>
  );
}
