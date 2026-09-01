export const EARTH_RADIUS = 1.6;
const DEG = Math.PI / 180;

export function latLonToXYZ(lat: number, lon: number, r: number = EARTH_RADIUS) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

export function writeLatLon(
  target: { set: (x: number, y: number, z: number) => unknown },
  lat: number,
  lon: number,
  r: number = EARTH_RADIUS,
) {
  const p = latLonToXYZ(lat, lon, r);
  target.set(p.x, p.y, p.z);
  return target;
}
