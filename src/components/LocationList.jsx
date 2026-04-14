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
              background:      active ? "#1d3b53"  : "transparent",
              borderLeftColor: active ? "#00e5c8"  : "transparent",
              color:           active ? "#d6deeb"  : "#5f7e97",
            }}
          >
            <div className="loc-row__name">{loc.name}</div>
            <span className="loc-row__meta">Pods: {loc.pods} &nbsp;|&nbsp; Fixed: </span>
            <span className="loc-row__val">{loc.carbonWeek} kg</span>
          </div>
        );
      })}
    </div>
  );
}
