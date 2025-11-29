// client/src/components/QuickActions.jsx
import React from "react";

function QuickActions({ modules, onModuleClick }) {
    if (!modules || modules.length === 0) {
        return null;
    }

    return (
        <div className="mx-4 mb-4 p-3 rounded-lg bg-gray-100">
            <h3 className="m-0 mb-2 text-sm text-gray-700 font-medium">
                📚 Modules disponibles
            </h3>
            <div className="flex flex-wrap gap-2">
                {modules.map((module, index) => (
                    <button
                        key={index}
                        onClick={() => onModuleClick(module)}
                        className="border-none rounded-full px-3 py-1.5 text-[13px] cursor-pointer bg-indigo-100 text-gray-800 transition-all duration-75 hover:translate-y-[-1px] hover:shadow-[0_1px_4px_rgba(0,0,0,0.08)] active:translate-y-0 active:shadow-none"
                    >
                        {module.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;
