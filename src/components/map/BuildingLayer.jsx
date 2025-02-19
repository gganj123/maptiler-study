import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function BuildingLayer(map) {
  if (!map) return;

  map.on("load", () => {
    map.addSource("maptiler-buildings", {
      type: "vector",
      url: "https://api.maptiler.com/tiles/3d-buildings/tiles.json?key=QGIRLXVffuVuB8yuNZlW",
    });

    map.addLayer({
      id: "3d-buildings-layer",
      source: "maptiler-buildings",
      "source-layer": "building",
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-color": "#aaaaaa",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.7,
      },
    });
  });
}
