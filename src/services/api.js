// src/services/api.js

import { parseSCADA } from "../utils/csvParser";

let cachedStats = null;
let cacheTime = 0;
const CACHE_TTL = 30_000;
const CSV_URL = "/scada_data.csv";

async function loadFromCSV() {
  const now = Date.now();
  if (cachedStats && now - cacheTime < CACHE_TTL) return cachedStats;
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Could not load CSV: ${res.status}`);
  const text = await res.text();
  cachedStats = await parseSCADA(text);
  cacheTime = now;
  return cachedStats;
}

export async function fetchDashboardStats() {
  const data = await loadFromCSV();
  return {
     totalPods: data.totalPods,
    carbonToday: data.carbonToday,
    carbonMonth: data.carbonMonth,
    carbonTotal: data.carbonTotal,
  };
}

export async function fetchLocations() {
  const data = await loadFromCSV();

  // Both pods are in Kohinoor Plaza 1, Jaranwala Road, Faisalabad
  // Tiny lat offset so both dots are separately visible on the map
  const DEVICE_META = {
    "923057700606": {
      name: "Kohinoor Plaza 1 – Office 60 (1st Floor)",
      address: "Kohinoor Plaza 1, Jaranwala Road, Faisalabad",
      lat: 31.41245,
      lng: 73.11490,
      deployDate: "2025-12-29",
    },
    "923137700778": {
      name: "Green Building – EPA Punjab (2nd Pod)",
      address: "27 College Rd, Block H Gulberg 2, Lahore",
      lat: 31.51985,
      lng: 74.33155,
      deployDate: "2025-12-31",
    },
    "923137700777": {
      name: "Green Building – EPA Punjab  (5nd Floor)",
      address: "27 College Rd, Block H Gulberg 2, Lahore",
      lat: 31.51980,
      lng: 74.33150,
      deployDate: "2025-12-30",
    },
  };

  return data.devices.map((dev, idx) => {
    const meta = DEVICE_META[dev.deviceId] ?? {
      name: `Pod ${dev.deviceId}`,
      address: "Faisalabad, Pakistan",
      lat: 31.41260,
      lng: 73.11500,
      deployDate: dev.lastSeen,
    };

    return {
      id: idx + 1,
      name: meta.name,
      address: meta.address,
      pods: 1,
      lat: meta.lat,
      lng: meta.lng,
      carbonWeek: dev.carbonWeek,
      deployDate: meta.deployDate,
      latestCO2: dev.latestCO2,
      latestOD: dev.latestOD,
      deviceId: dev.deviceId,
    };
  });
}

export async function fetchSparkline(deviceId = null) {
  const data = await loadFromCSV();
  if (!deviceId) return data.sparkline.map((s) => s.avgCO2);

  const deviceReadings = data.readings.filter((r) => r.deviceId === deviceId);
  const byDate = {};
  for (const r of deviceReadings) {
    const d = r.timestamp.toISOString().slice(0, 10);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(r.co2);
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, vals]) => +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1));
}
