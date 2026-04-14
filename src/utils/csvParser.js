// src/utils/csvParser.js
// Parses your SCADA CSV data and computes all dashboard values.
//
// CSV format (semicolon-separated, no header):
// col0=id | col1=device_id | col2=co2_ppm | col3=null | col4=od_value | col5=air | ... | col13=raw_message | col14=timestamp
//
// HOW TO USE:
//   import { parseSCADA } from "../utils/csvParser";
//   const result = await parseSCADA("/data/scada_data.csv");
//
// CARBON CONVERSION FORMULA:
//   carbonTonnes = co2_ppm * CARBON_FACTOR
//   Change CARBON_FACTOR below to match your real engineering formula.

const CARBON_FACTOR = 0.001; // placeholder: 1 CO2 ppm reading = 0.001 tonne fixed

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function parseRow(line) {
  // Strip surrounding quotes from each field
  return line.split(";").map((f) => f.replace(/^"+|"+$/g, "").trim());
}

function isRealDevice(deviceId) {
  // Only accept rows with a real Pakistani phone number as device ID
  return /^\+?923\d{9}$/.test(deviceId.trim());
}

function cleanDeviceId(raw) {
  return raw.replace(/^\+/, "").trim();
}

// -------------------------------------------------------------------
// Main parser
// -------------------------------------------------------------------

export async function parseSCADA(csvText) {
  const lines = csvText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const readings = [];

  for (const line of lines) {
    const cols = parseRow(line);
    if (cols.length < 15) continue;

    const deviceRaw = cols[1];
    if (!isRealDevice(deviceRaw)) continue;

    const co2 = parseFloat(cols[2]) || 0;
    const od  = parseFloat(cols[4]) || 0;
    const ts  = new Date(cols[14]);

    if (isNaN(ts.getTime())) continue;

    readings.push({
      id:       parseInt(cols[0]),
      deviceId: cleanDeviceId(deviceRaw),
      co2,
      od,
      timestamp: ts,
    });
  }

  // Sort oldest → newest
  readings.sort((a, b) => a.timestamp - b.timestamp);

  return computeStats(readings);
}

// -------------------------------------------------------------------
// Stats computation — all dashboard values derived here
// -------------------------------------------------------------------

function computeStats(readings) {
  if (!readings.length) return null;

  const lastTimestamp = readings[readings.length - 1].timestamp;
  const lastDateStr   = lastTimestamp.toISOString().slice(0, 10);

  // Today's readings = same calendar date as the most recent reading
  const todayReadings = readings.filter(
    (r) => r.timestamp.toISOString().slice(0, 10) === lastDateStr
  );

  // Unique pods
  const uniqueDevices = [...new Set(readings.map((r) => r.deviceId))];

  // Carbon values
  const carbonToday = +(
    todayReadings.reduce((sum, r) => sum + r.co2, 0) * CARBON_FACTOR
  ).toFixed(2);

  const carbonTotal = +(
    readings.reduce((sum, r) => sum + r.co2, 0) * CARBON_FACTOR
  ).toFixed(1);

  // Current CO2 and OD (latest reading)
  const latest = readings[readings.length - 1];

  // Per-device summary (used in location list)
  const deviceSummary = uniqueDevices.map((devId) => {
    const devReadings = readings.filter((r) => r.deviceId === devId);
    const lastReading = devReadings[devReadings.length - 1];
    const weekAgo     = new Date(lastTimestamp.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekReadings = devReadings.filter((r) => r.timestamp >= weekAgo);

    return {
      deviceId:    devId,
      totalReadings: devReadings.length,
      latestCO2:   lastReading.co2,
      latestOD:    lastReading.od,
      lastSeen:    lastReading.timestamp.toISOString().slice(0, 10),
      carbonWeek:  +(weekReadings.reduce((s, r) => s + r.co2, 0) * CARBON_FACTOR).toFixed(2),
    };
  });

  // Sparkline — daily average CO2 across all devices
  const byDate = {};
  for (const r of readings) {
    const d = r.timestamp.toISOString().slice(0, 10);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(r.co2);
  }
  const sparkline = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      date,
      avgCO2: +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1),
    }));

  return {
    // ── StatCards ──────────────────────────────────────────
    totalPods:    uniqueDevices.length,
    carbonToday,
    carbonMonth:  carbonTotal,   // all data is within a month
    carbonTotal,

    // ── Live sensor readings ────────────────────────────────
    latestCO2:    latest.co2,
    latestOD:     latest.od,
    lastUpdated:  latest.timestamp.toISOString(),

    // ── Per-device detail (feeds LocationList) ─────────────
    devices:      deviceSummary,

    // ── Sparkline data (feeds SparkLine component) ──────────
    sparkline,    // [{ date, avgCO2 }, ...]

    // ── Raw readings (optional — for future charts) ─────────
    readings,
  };
}
