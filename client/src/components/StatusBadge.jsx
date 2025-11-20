import React from "react";

function StatusBadge({ online, label }) {
  return (
    <div className="badge-pill">
      <span className="label">
        <div className="status-wrapper">
          <span
            className={
              "status-dot " + (online ? "status-online" : "status-offline")
            }
          />
          <span className="status-label">{label}</span>
        </div>
      </span>
    </div>
  );
}

export default StatusBadge;
