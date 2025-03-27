export function extractLatLng(url: string): {
  latitude: number;
  longitude: number;
} {
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
    };
  }
  return {
    latitude: 0,
    longitude: 0,
  };
}
