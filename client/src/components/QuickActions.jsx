// client/src/components/ModuleQuickActions.jsx
import React from "react";

function QuickActions({ modules, onModuleClick }) {
  if (!modules || modules.length === 0) return null;

  return (
    <div className="module-quick-actions">
      <p className="module-quick-actions-title">
        Cliquer directement sur un module pour débuter la conversation :
      </p>
      <div className="module-quick-actions-list">
        {modules.map((module) => (
          <button
            key={module.id}
            type="button"
            className="module-chip"
            onClick={() => onModuleClick(module)}
          >
            {module.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;