// src/components/admin/PromptsList.jsx

import React from 'react';
import { List, Hash, ChevronRight, Search } from 'lucide-react';

function PromptsList({ prompts, selectedKey, onSelect }) {
    
    // --- État vide ---
    if (!prompts || prompts.length === 0) {
        return (
            <div className="w-72 h-full bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6">
                <List className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">Aucun prompt</p>
            </div>
        );
    }

    return (
        <aside className="w-full md:w-72 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            
            {/* --- En-tête de la liste --- */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                    <List className="w-4 h-4 text-slate-400" />
                    Bibliothèque
                </h3>
                <p className="text-xs text-slate-500 mt-1 pl-6">
                    {prompts.length} prompt{prompts.length > 1 ? 's' : ''} disponible{prompts.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* --- Liste Défilante --- */}
            <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {prompts.map((prompt) => (
                    <PromptItem
                        key={prompt.key}
                        prompt={prompt}
                        isActive={prompt.key === selectedKey}
                        onClick={() => onSelect(prompt.key)}
                    />
                ))}
            </div>
        </aside>
    );
}

function PromptItem({ prompt, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                group w-full text-left relative flex flex-col gap-1 p-3 rounded-xl transition-all duration-200 border
                ${isActive 
                    ? 'bg-nws-purple/5 border-nws-purple shadow-sm z-10' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }
            `}
        >
            {/* Indicateur actif (Barre latérale ou icône) */}
            {isActive && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-nws-purple animate-in slide-in-from-left-2 fade-in">
                    <ChevronRight className="w-4 h-4" />
                </div>
            )}

            {/* Clé Technique (ex: SYSTEM_MENTOR) */}
            <div className="flex items-center gap-1.5">
                <Hash className={`w-3 h-3 ${isActive ? 'text-nws-purple' : 'text-slate-400'}`} />
                <span className={`
                    text-xs font-mono font-bold truncate pr-4
                    ${isActive ? 'text-nws-purple' : 'text-slate-600 group-hover:text-slate-800'}
                `}>
                    {prompt.key}
                </span>
            </div>

            {/* Label (Description) */}
            <div className={`
                text-sm pl-4.5 line-clamp-2
                ${isActive ? 'text-slate-700 font-medium' : 'text-slate-500 group-hover:text-slate-600'}
            `}>
                {prompt.label || <span className="italic opacity-50">Sans description</span>}
            </div>
        </button>
    );
}

export default PromptsList;