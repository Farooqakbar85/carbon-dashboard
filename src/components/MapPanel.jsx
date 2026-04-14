// src/components/MapPanel.jsx
import { useEffect, useRef } from "react";
import DetailPanel from "./DetailPanel";

const MAP_CENTER = { lat: 31.41255, lng: 73.11500 };
const MAP_ZOOM   = 19;

export default function MapPanel({ locations, selected, onSelect }) {
  const mapRef     = useRef(null);
  const gMapRef    = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    gMapRef.current = new window.google.maps.Map(mapRef.current, {
      center:            MAP_CENTER,
      zoom:              MAP_ZOOM,
      mapTypeId:         "satellite",
      tilt:              0,
      zoomControl:       true,
      mapTypeControl:    false,
      streetViewControl: false,
      fullscreenControl: true,
    });
  }, []);

  useEffect(() => {
    if (!gMapRef.current || !locations.length) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    locations.forEach((loc) => {
      const isSelected = selected?.id === loc.id;
      const pinColor   = isSelected ? "#ff4d5e" : "#00e5c8";
      const pinSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><circle cx="16" cy="16" r="14" fill="${pinColor}" opacity="0.9"/><circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/><line x1="16" y1="30" x2="16" y2="40" stroke="${pinColor}" stroke-width="2"/></svg>`;

      const marker = new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map:      gMapRef.current,
        title:    loc.name,
        icon: {
          url:    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSVG)}`,
          anchor: new window.google.maps.Point(16, 40),
        },
      });
      marker.addListener("click", () => onSelect(loc));
      markersRef.current.push(marker);
    });
  }, [locations, selected, onSelect]);

  useEffect(() => {
    if (!gMapRef.current || !selected) return;
    gMapRef.current.panTo({ lat: selected.lat, lng: selected.lng });
  }, [selected]);

  return (
    <div className="map-wrapper">
      <div className="map-label">Kohinoor Plaza 1, Faisalabad — Satellite View</div>
      <div ref={mapRef} className="map-area" />
      <DetailPanel location={selected} />
    </div>
  );
}
