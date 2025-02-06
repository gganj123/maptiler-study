import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const zoom = 14;
  maptilersdk.config.apiKey = "QGIRLXVffuVuB8yuNZlW";

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom,
    });

    new maptilersdk.Marker({ color: "#FF0000" })
      .setLngLat([139.7525, 35.6846])
      .addTo(map.current);

    const polygonData = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [139.751, 35.683], // 좌표 1
            [139.754, 35.681], // 좌표 2
            [139.756, 35.6835], // 좌표 3
            [139.754, 35.686], // 좌표 4
            [139.751, 35.685], // 좌표 5
            [139.751, 35.683], // (닫는 좌표)
          ],
        ],
      },
      properties: {},
    };

    // 폴리곤을 지도에 추가
    map.current.on("load", () => {
      map.current.addSource("polygon", {
        type: "geojson",
        data: polygonData,
      });

      map.current.addLayer({
        id: "polygon-layer",
        type: "fill",
        source: "polygon",
        layout: {},
        paint: {
          "fill-color": "#00FF00",
          "fill-opacity": 0.5,
        },
      });
    });
  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
