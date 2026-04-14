// src/components/LocationList.jsx
export default function LocationList({ locations, selected, onSelect }) {
  return (
    <div>
      <div className="loc-heading">Deployed Locations</div>
      {locations.map((loc) => {
        const active = selected?.id === loc.id;
        return (
          <div
            key={loc.id}
            className="loc-row"
            onClick={() => onSelect(loc)}
            style={{
              background:      active ? "#0d2a22"  : "transparent",
              borderLeftColor: active ? "#00e5c8"  : "transparent",
              color:           active ? "#c8f0ea"  : "#4a9e8a",
            }}
          >
            <div className="loc-row__name">{loc.name}</div>
            <span className="loc-row__meta">Pods: {loc.pods} &nbsp;|&nbsp; Fixed: </span>
            <span className="loc-row__val">{loc.carbonWeek}t</span>
          </div>
        );
      })}
    </div>
  );
}
