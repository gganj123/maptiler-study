import "@maptiler/sdk/dist/maptiler-sdk.css";

import * as maptilersdk from "@maptiler/sdk";

export default function MarkerLayer(map) {
  if (!map) return;

  new maptilersdk.Marker({ color: "#FF0000" }).setLngLat([126.9779692, 37.566535]).addTo(map);
}
