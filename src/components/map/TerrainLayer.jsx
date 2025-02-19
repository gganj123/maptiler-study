import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function TerrainLayer(map, is3D) {
  if (!map) return;

  if (is3D) {
    if (!map.getSource("maptiler-terrain")) {
      map.addSource("maptiler-terrain", {
        type: "raster-dem",
        url: "https://api.maptiler.com/tiles/terrain-quantized-mesh/?key=QGIRLXVffuVuB8yuNZlW",
        tileSize: 256,
        maxzoom: 13,
      });
    }

    map.setTerrain({
      source: "maptiler-terrain",
      exaggeration: 3,
    });

    map.easeTo({ pitch: 60, bearing: 30 });

    map.addLayer({
      id: "hillshade",
      type: "hillshade",
      source: "maptiler-terrain",
      paint: {
        "hillshade-exaggeration": 0.8,
        "hillshade-shadow-color": "#5a5a5a",
        "hillshade-highlight-color": "#ffffff",
      },
    });
  } else {
    map.setTerrain(null);
    map.easeTo({ pitch: 0, bearing: 0 });
  }
}
