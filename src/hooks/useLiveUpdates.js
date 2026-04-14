// src/hooks/useLiveUpdates.js
// Re-fetches stats every 30 seconds (matches CSV cache TTL in api.js).
// When you move to a real backend, reduce interval to 5-8 seconds.

import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../services/api";

const POLL_INTERVAL_MS = 30_000; // 30s — matches CSV cache in api.js

export function useLiveUpdates(setStats) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await fetchDashboardStats();
        setStats(fresh);
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      } catch {
        // silently keep last known values
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [setStats]);

  return { pulse };
}
