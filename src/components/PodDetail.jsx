// src/components/PodDetail.jsx
import SparkLine from "./SparkLine";

export default function PodDetail({ location, onBack }) {
  if (!location) return null;

  return (
    <div className="pod-detail">

      {/* Back button */}
      <button className="pod-detail__back" onClick={onBack}>
        ← Back to Map
      </button>

      {/* Title */}
      <div className="pod-detail__header">
        <div className="pod-detail__badge">Pod Details</div>
        <div className="pod-detail__name">{location.name}</div>
        <div className="pod-detail__address">{location.address}</div>
      </div>

      {/* Main stats grid */}
      <div className="pod-detail__grid">
        <div className="pod-detail__card">
          <div className="pod-detail__card-label">Pods Deployed</div>
          <div className="pod-detail__card-value">{location.pods}</div>
        </div>
        <div className="pod-detail__card">
          <div className="pod-detail__card-label">Deployment Date</div>
          <div className="pod-detail__card-value pod-detail__card-value--sm">{location.deployDate}</div>
        </div>
        <div className="pod-detail__card">
          <div className="pod-detail__card-label">Latest CO₂ (ppm)</div>
          <div className="pod-detail__card-value">{location.latestCO2}</div>
        </div>
        <div className="pod-detail__card">
          <div className="pod-detail__card-label">Carbon Fixed This Week</div>
          <div className="pod-detail__card-value">{location.carbonWeek} <span className="pod-detail__unit">kg</span></div>
        </div>
        <div className="pod-detail__card">
          <div className="pod-detail__card-label">OD Value</div>
          <div className="pod-detail__card-value">{location.latestOD}</div>
        </div>
        <div className="pod-detail__card">
          <div className="pod-detail__card-label">Device ID</div>
          <div className="pod-detail__card-value pod-detail__card-value--sm">{location.deviceId}</div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="pod-detail__chart">
        <div className="pod-detail__chart-label">CO₂ Trend — Daily Average (ppm)</div>
        <SparkLine deviceId={location.deviceId} height={120} />
      </div>

    </div>
  );
}
