// src/components/StatCard.jsx
import { useAnimatedNumber } from "../utils/animateNumber";

export default function StatCard({ label, value, decimals = 0, suffix = "" }) {
  const animated = useAnimatedNumber(value);
  const display  = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated);

  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">
        {display}
        {suffix && <span className="stat-card__suffix">{suffix}</span>}
      </div>
    </div>
  );
}
