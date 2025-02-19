import { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import MarkerLayer from "./MarkerLayer";

export default function MapContainer() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [is3D, setIs3D] = useState(false); // 3D 모드 상태
  const seoul = { lng: 126.9779692, lat: 37.566535 };
  const zoom = 14;

  maptilersdk.config.apiKey = "QGIRLXVffuVuB8yuNZlW";

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [seoul.lng, seoul.lat],
      zoom: zoom,
      pitch: is3D ? 60 : 0, // 3D 모드일 때 기울기 적용
    });

    MarkerLayer(map.current);

    // 3D Terrain (지형 데이터) 추가
    if (is3D) {
      map.current.setTerrain({
        source: "maptiler-terrain",
        exaggeration: 3, // 지형 강조 효과
      });
    }

    // 폴리곤 추가
    const polygonData = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [139.751, 35.683],
            [139.754, 35.681],
            [139.756, 35.6835],
            [139.754, 35.686],
            [139.751, 35.685],
            [139.751, 35.683],
          ],
        ],
      },
      properties: {},
    };

    map.current.on("load", () => {
      map.current.addSource("polygon", {
        type: "geojson",
        data: polygonData,
      });

      map.current.addLayer({
        id: "hillshade",
        type: "hillshade",
        source: "maptiler-terrain",
        paint: {
          "hillshade-exaggeration": 0.8, // 지형 강조
          "hillshade-shadow-color": "#5a5a5a", // 그림자 색상
          "hillshade-highlight-color": "#ffffff", // 강조된 부분
        },
      });
    });
  }, [is3D]); // is3D 변경될 때마다 실행

  // 2D / 3D 토글 함수
  const toggle3D = () => {
    if (!map.current) return;

    if (!is3D) {
      if (!map.current.getSource("maptiler-terrain")) {
        map.current.addSource("maptiler-terrain", {
          type: "raster-dem",
          url: "https://api.maptiler.com/tiles/terrain-quantized-mesh/tiles.json?key=QGIRLXVffuVuB8yuNZlW",
          tileSize: 256,
          maxzoom: 13,
        });
      }
      // 3D 모드 활성화
      map.current.setTerrain({
        source: "maptiler-terrain",
        exaggeration: 3,
      });
      map.current.easeTo({ pitch: 60, bearing: 30 }); // 기울이기 + 회전
    } else {
      // 2D 모드로 변경
      map.current.setTerrain(null);
      map.current.easeTo({ pitch: 0, bearing: 0 });
    }

    setIs3D(!is3D);
  };

  return (
    <div className="map-wrap">
      <div className="map-buttons">
        <button onClick={toggle3D}>{is3D ? "2D 보기" : "3D 보기"}</button>
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
