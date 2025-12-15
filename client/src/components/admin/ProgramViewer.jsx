// ./src/components/admin/ProgramViewer.jsx

import React from 'react';
import { Calendar, Package, CheckCircle2, Clock } from "lucide-react";

// Configuration des mois (statique pour l'affichage)
const MONTHS = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' }, { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' }, { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' },
];

const getMonthLabel = (val) => MONTHS.find(m => m.value === val)?.label || val;

// Palette pour cycler les couleurs des modules
const THEME_COLORS = [
    { border: 'border-nws-purple', text: 'text-nws-purple', bg: 'bg-nws-purple/10', bullet: 'bg-nws-purple' },
    { border: 'border-nws-teal', text: 'text-nws-teal', bg: 'bg-nws-teal/10', bullet: 'bg-nws-teal' },
    { border: 'border-nws-yellow', text: 'text-nws-yellow', bg: 'bg-nws-yellow/10', bullet: 'bg-nws-yellow' },
    { border: 'border-nws-red', text: 'text-nws-red', bg: 'bg-nws-red/10', bullet: 'bg-nws-red' },
];

export default function ProgramViewer({ program }) {
    if (!program) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 font-sans text-slate-800">
            
            {/* --- En-tête du Programme --- */}
            <header className="mb-16 text-center space-y-4">
                <span className="inline-block py-1 px-4 rounded-full bg-nws-purple/10 text-nws-purple font-bold text-sm tracking-wide uppercase">
                    Programme {program.key}
                </span>
                <h1 className="text-4xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {program.label}
                </h1>
                {program.description && (
                    <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
                        {program.description}
                    </p>
                )}
            </header>

            {/* --- Grille des Modules --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {program.modules?.map((module, index) => {
                    // Sélection de la couleur basée sur l'index (cycle infini)
                    const theme = THEME_COLORS[index % THEME_COLORS.length];

                    return (
                        <article 
                            key={module.id || index}
                            className={`
                                group relative bg-white rounded-xxl p-6 
                                shadow-soft hover:shadow-lg transition-all duration-300 
                                border-t-4 ${theme.border} flex flex-col h-full
                            `}
                        >
                            {/* Période */}
                            <div className="flex justify-between items-center mb-4">
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${theme.bg} ${theme.text}`}>
                                    {getMonthLabel(module.start_month)} — {getMonthLabel(module.end_month)}
                                </div>
                            </div>

                            {/* Titre du Module */}
                            <h3 className="text-xl font-bold text-slate-800 mb-6 group-hover:text-nws-purple transition-colors">
                                {module.label}
                            </h3>

                            {/* Contenu (Liste à puces) */}
                            <div className="flex-grow">
                                {module.content && module.content.length > 0 ? (
                                    <ul className="space-y-3">
                                        {module.content.map((line, i) => (
                                            <li key={i} className="flex items-start text-sm text-slate-600 leading-snug">
                                                <span className={`mt-1.5 mr-3 w-2 h-2 rounded-full flex-shrink-0 ${theme.bullet}`} />
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-400 italic text-sm">Contenu à venir.</p>
                                )}
                            </div>

                            {/* Livrables (Section Footer de la carte) */}
                            {module.deliverables && module.deliverables.length > 0 && (
                                <div className="mt-8 pt-4 border-t border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                        Livrables attendus
                                    </p>
                                    <div className="space-y-2">
                                        {module.deliverables.map((deliv, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg">
                                                <span className="font-medium text-slate-700 truncate pr-2" title={deliv.descriptif}>
                                                    📦 {deliv.descriptif}
                                                </span>
                                                {deliv.date && (
                                                    <span className="whitespace-nowrap text-slate-400">
                                                        {new Date(deliv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>

            {/* --- Empty State --- */}
            {(!program.modules || program.modules.length === 0) && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Aucun module n'est visible pour le moment.</p>
                </div>
            )}
        </div>
    );
}