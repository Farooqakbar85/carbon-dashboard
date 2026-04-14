// src/components/DetailPanel.jsx
import SparkLine from "./SparkLine";

export default function DetailPanel({ location }) {
  if (!location) return null;

  return (
    <div className="detail-panel">

      <div className="detail-panel__title-row">
        <span className="detail-panel__badge">Location Details:</span>
        <span className="detail-panel__name">{location.name}</span>
      </div>

      <div className="detail-panel__grid">
        <div>
          <div className="detail-label">Pods Deployed</div>
          <div className="detail-value">{location.pods}</div>
        </div>
        <div>
          <div className="detail-label">Last Reading</div>
          <div className="detail-value detail-value--sm">{location.deployDate}</div>
        </div>
        <div>
          <div className="detail-label">CO2 (ppm)</div>
          <div className="detail-value">{location.latestCO2}</div>
        </div>
        <div>
          <div className="detail-label">Carbon Fixed This Week</div>
          <div className="detail-value">{location.carbonWeek} kg</div>
        </div>
      </div>

      <div className="detail-panel__od-row">
        <span className="detail-label">OD VALUE:</span>
        <span className="detail-value" style={{ fontSize: 14, marginLeft: 6 }}>{location.latestOD}</span>
        <span className="detail-label" style={{ marginLeft: 20 }}>DEVICE ID:</span>
        <span className="detail-device-id">{location.deviceId}</span>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="detail-label" style={{ marginBottom: 6 }}>CO2 Trend — Daily Average (ppm)</div>
        <SparkLine deviceId={location.deviceId} />
      </div>

    </div>
  );
}
