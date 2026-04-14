export const MAP_BOUNDS = {
  LAT_MIN: 31.47,
  LAT_MAX: 31.58,
  LNG_MIN: 74.29,
  LNG_MAX: 74.43,
};

export function latLngToSVG(lat, lng, svgWidth, svgHeight) {
  const { LAT_MIN, LAT_MAX, LNG_MIN, LNG_MAX } = MAP_BOUNDS;
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * svgWidth;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * svgHeight;
  return { x, y };
}