// src/components/Header.jsx
export default function Header({ pulse }) {
  return (
    <header className="header">
      <div className="header__dot" />
      <div>
        <h1 className="header__title">Punjab Carbon Offset Tracker</h1>
        <p className="header__sub">Carbon Fixed by OxyGenix &nbsp;|&nbsp; Real-Time Indigenous Climate Action</p>
      </div>
      <div className="header__live">
        LIVE &nbsp;
        <span style={{ color: pulse ? "#00e5c8" : "#2a7a60", transition: "color 0.3s" }}>●</span>
      </div>
    </header>
  );
}
