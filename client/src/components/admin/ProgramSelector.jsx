// ./src/components/admin/ProgramSelector.jsx

import React from 'react';

export default function ProgramSelector({ programs, selectedKey, onSelect }) {
    
    // Si aucun programme
    if (!programs || programs.length === 0) {
        return null;
    }

    return (
        <nav className="mb-1">
            {/* Conteneur Flex pour aligner les onglets */}
            <ul className="flex flex-wrap justify-center gap-5">
                {programs.map((program) => {
                    const isActive = program.key === selectedKey;

                    return (
                        <li key={program.key}>
                            <button
                                onClick={() => onSelect(program.key)}
                                className={`
                                    group flex items-center gap-3 px-6 py-3 
                                    rounded-xl border transition-all duration-300 ease-out
                                    ${isActive 
                                        ? 'bg-nws-purple border-nws-purple text-white shadow-button transform -translate-y-1' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-nws-purple hover:text-nws-purple hover:shadow-soft'
                                    }
                                `}
                            >
                                {/* Badge de la Clé (ex: B1, B2) */}
                                <span className={`
                                    text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg
                                    ${isActive 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-slate-100 text-slate-500 group-hover:bg-nws-purple/10 group-hover:text-nws-purple'
                                    }
                                `}>
                                    {program.key}
                                </span>

                                {/* Nom du programme */}
                                <span className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>
                                    {program.label || "(Sans nom)"}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}