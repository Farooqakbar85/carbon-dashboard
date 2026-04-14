// src/components/Header.jsx
import terraSparkLogo from "../assets/Terra_spark_logo.png";

export default function Header({ pulse }) {
  return (
    <header className="header">
      <img src={terraSparkLogo} alt="TerraSpark" className="header__logo" />
      <div className="header__divider" />
      <div>
        <h1 className="header__title">Punjab Carbon Offset Tracker</h1>
        <p className="header__sub">Carbon Fixed by OxyGenix &nbsp;|&nbsp; Real-Time Indigenous Climate Action</p>
      </div>
    </header>
  );
}