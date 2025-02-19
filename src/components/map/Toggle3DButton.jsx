import PropTypes from "prop-types";
import useMapStore from "../../stores/mapStore/mapStore";

export default function Toggle3DButton({ map }) {
  const { is3D, toggle3D } = useMapStore();
  const handleClick = () => {
    if (!map.current) return;

    if (!is3D) {
      map.current.setTerrain({
        source: "maptiler-terrain",
        exaggeration: 3,
      });
      map.current.easeTo({ pitch: 60, bearing: 30 });
    } else {
      map.current.setTerrain(null);
      map.current.easeTo({ pitch: 0, bearing: 0 });
    }

    toggle3D(); // ✅ Zustand 상태 변경
  };

  return <button onClick={handleClick}>{is3D ? "2D 보기" : "3D 보기"}</button>;
}

// ✅ PropTypes 유효성 검사 추가
Toggle3DButton.propTypes = {
  map: PropTypes.object,
};
