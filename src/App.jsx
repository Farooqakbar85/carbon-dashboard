// src/App.jsx
import { useState, useEffect } from "react";
import "./index.css";

import Header       from "./components/Header";
import StatCard     from "./components/StatCard";
import LocationList from "./components/LocationList";
import MapPanel     from "./components/MapPanel";
import PodDetail    from "./components/PodDetail";

import { useDashboardData } from "./hooks/useDashboardData";
import { useLiveUpdates }   from "./hooks/useLiveUpdates";

export default function App() {
  const { stats, setStats, locations, loading, error } = useDashboardData();
  const { pulse } = useLiveUpdates(setStats);

  const [selected,    setSelected]    = useState(null);
  const [detailView,  setDetailView]  = useState(false);
  const [mapsReady,   setMapsReady]   = useState(false);

  if (locations.length && selected === null) {
    setSelected(locations[0]);
  }

  function handleSelectLocation(loc) {
    setSelected(loc);
    setDetailView(true);
  }

  function handleBackToMap() {
    setDetailView(false);
  }

  useEffect(() => {
    if (window.google) { setMapsReady(true); return; }
    const iv = setInterval(() => {
      if (window.google) { setMapsReady(true); clearInterval(iv); }
    }, 200);
    return () => clearInterval(iv);
  }, []);

  if (loading) return (
    <div className="screen-center">
      <div className="loading-dot" />
      <div className="loading-text">INITIALIZING TRACKER...</div>
    </div>
  );

  if (error) return (
    <div className="screen-center">
      <div className="error-title">CONNECTION ERROR</div>
      <div className="error-msg">{error}</div>
    </div>
  );

  return (
    <div>
      <Header pulse={pulse} />
      <div className="layout">

        <aside className="sidebar">
          <div className="sidebar__title">Network Overview (District Faisalabad)</div>
          <div className="stat-cards-row">
            <StatCard label="Total OxyGenix Trees Deployed"  value={stats.totalPods}   decimals={0} />
            <StatCard label="Carbon Fixed Today (KG)"        value={stats.carbonToday} decimals={2} />
            <StatCard label="Carbon Fixed This Month (KG)"   value={stats.carbonMonth} decimals={1} />
            <StatCard label="Total Carbon Fixed Since Launch" value={stats.carbonTotal} decimals={1} suffix=" KG" />
          </div>
          <LocationList locations={locations} selected={selected} onSelect={handleSelectLocation} />
        </aside>

        <main className="main">
          {detailView ? (
            <PodDetail location={selected} onBack={handleBackToMap} />
          ) : mapsReady ? (
            <MapPanel locations={locations} selected={selected} onSelect={handleSelectLocation} />
          ) : (
            <div className="screen-center" style={{ minHeight: "unset", height: "100%" }}>
              <div className="loading-dot" />
              <div className="loading-text">LOADING SATELLITE MAP...</div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
