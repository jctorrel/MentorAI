// client/src/components/TabBar.jsx
import React from "react";
import { BookOpen, Sparkles, MessageSquare } from "lucide-react";

function TabBar({ activeMode, onModeChange }) {
    const modes = [
        { 
            id: "guided", 
            label: "Mode Guidé", 
            icon: BookOpen, 
            color: "text-blue-600" 
        },
        { 
            id: "free", 
            label: "Mode Libre", 
            icon: Sparkles, // Sparkles fait plus "AI" que le chat classique
            color: "text-purple-600" 
        }
    ];

    return (
        <div className="w-full bg-slate-100/80 p-1.5 rounded-[18px] border border-slate-200/60">
            <div className="flex relative">
                {modes.map((mode) => {
                    const isActive = activeMode === mode.id;
                    const Icon = mode.icon;

                    return (
                        <button
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            className={`
                                relative flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out
                                ${isActive 
                                    ? "bg-white text-slate-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] ring-1 ring-black/5" 
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }
                            `}
                        >
                            <Icon 
                                size={18} 
                                className={`transition-colors duration-300 ${isActive ? mode.color : "text-slate-400"}`} 
                                strokeWidth={isActive ? 2 : 1.5}
                            />
                            
                            <span>{mode.label}</span>
                            
                            {/* Petit point indicateur pour l'actif */}
                            {isActive && (
                                <span className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${mode.id === 'free' ? 'bg-purple-500' : 'bg-blue-500'} opacity-0 sm:opacity-100 transition-opacity`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default TabBar;