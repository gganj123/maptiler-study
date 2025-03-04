export function convertLatLngToXYZ(lng: number, lat: number, altitude = 20) {
  const scaleFactor = 0.01; // 📌 Three.js에서 보이도록 좌표 크기 조정
  const R = 6371; // 지구 반경 (km)

  const x =
    R *
    Math.cos(lat * (Math.PI / 180)) *
    Math.cos(lng * (Math.PI / 180)) *
    scaleFactor;
  const y = altitude; // 고도 (z 축)
  const z =
    R *
    Math.cos(lat * (Math.PI / 180)) *
    Math.sin(lng * (Math.PI / 180)) *
    scaleFactor;

  console.log(
    `🌍 변환된 좌표 (lng: ${lng}, lat: ${lat}) -> [x: ${x}, y: ${y}, z: ${z}]`,
  );
  return [x, y, z];
}
