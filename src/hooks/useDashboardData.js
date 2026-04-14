// src/hooks/useDashboardData.js
// Fetches stats and locations on mount.
// Now reads from real CSV data via api.js → csvParser.js

import { useState, useEffect } from "react";
import { fetchDashboardStats, fetchLocations } from "../services/api";

export function useDashboardData() {
  const [stats,     setStats]     = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchLocations()])
      .then(([statsData, locationsData]) => {
        setStats(statsData);
        setLocations(locationsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, setStats, locations, loading, error };
}
