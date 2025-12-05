import React from "react";

function StatusBadge({ backendOnline, backendStatusLabel, count, limit }) {
  return (
    <div className="ml-auto hidden sm:flex flex-col items-end gap-1 text-[9px] text-gray-500">
      <span className="px-2 py-[3px] rounded-full border border-indigo-300/70 bg-white/90 inline-flex items-center gap-1.5 text-gray-600">
        <span
          className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
        />
        {backendStatusLabel} <small>({count}/{limit})</small>
      </span>
    </div>
  );
}

export default StatusBadge;
