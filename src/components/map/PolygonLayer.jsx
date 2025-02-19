import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function PolygonLayer(map) {
  if (!map) return;

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

  map.on("load", () => {
    map.addSource("polygon", {
      type: "geojson",
      data: polygonData,
    });

    map.addLayer({
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
}
