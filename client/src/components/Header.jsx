import React from "react";
import StatusBadge from "./StatusBadge.jsx";

function Header({ backendOnline, backendStatusLabel }) {
  return (
    <header className="app-header">
      <img
        src="https://normandiewebschool.fr/wp-content/uploads/2023/10/Logo-NWS.svg"
        alt="Logo NWS"
        title="Logo NWS"
        className="logo"
      />
      <div className="app-title">
        <h1>Mentor AI</h1>
        <span>Accompagnement individuel</span>
      </div>
      <StatusBadge online={backendOnline} label={backendStatusLabel} />
    </header>
  );
}

export default Header;
