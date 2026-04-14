// src/components/SparkLine.jsx
// Renders a CO2 trend area chart.
// Fetches real per-device data from api.js when deviceId is provided.

import { useEffect, useState } from "react";
import { fetchSparkline } from "../services/api";

export default function SparkLine({ deviceId = null }) {
  const [values, setValues] = useState([]);

  useEffect(() => {
    fetchSparkline(deviceId)
      .then(setValues)
      .catch(() => setValues([]));
  }, [deviceId]);

  if (!values.length) {
    return (
      <div style={{ height: 50, display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: "#2a7a60", letterSpacing: 1 }}>LOADING TREND...</span>
      </div>
    );
  }

  const points = values.length;
  const max    = Math.max(...values);
  const min    = Math.min(...values);
  const W = 300, H = 50;

  const norm     = values.map((v) => ((v - min) / (max - min || 1)) * 40 + 5);
  const linePath = norm
    .map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (points - 1)) * W} ${H - y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 50 }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00e5c8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00e5c8" stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={`${linePath} L ${W} ${H} L 0 ${H} Z`} fill="url(#sparkGrad)" />
      <path d={linePath} fill="none" stroke="#00e5c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
