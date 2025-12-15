// ./src/components/admin/ProgramViewer.jsx

import React from 'react';
import { Calendar, Package, CheckCircle2, Clock } from "lucide-react";

// Configuration des mois (statique pour l'affichage)
const MONTHS = [
    { value: 1, label: 'jan' }, { value: 2, label: 'fév' },
    { value: 3, label: 'mar' }, { value: 4, label: 'avr' },
    { value: 5, label: 'mai' }, { value: 6, label: 'jui' },
    { value: 7, label: 'jui' }, { value: 8, label: 'aoû' },
    { value: 9, label: 'sep' }, { value: 10, label: 'oct' },
    { value: 11, label: 'nov' }, { value: 12, label: 'déc' },
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
        <div className="max-w-7xl mx-auto px-1 py-5 font-sans text-slate-800">

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
                                group flex flex-col h-full relative
                                bg-white rounded-2xl overflow-hidden
                                border border-slate-200
                                shadow-sm hover:shadow-xl hover:-translate-y-1
                                transition-all duration-300 ease-out
                            `}
                        >
                            {/* Barre de couleur décorative en haut (remplace la bordure) */}
                            <div className={`h-2 w-full ${theme.bullet}`} />

                            {/* --- Corps de la carte (Contenu) --- */}
                            <div className="p-6 flex-grow flex flex-col">

                                {/* En-tête : Période */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`
                                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                                            text-xs font-bold uppercase tracking-wide 
                                            bg-slate-50 text-slate-500 border border-slate-100
                                            group-hover:border-slate-200 transition-colors
                                        `}>
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <span>
                                            {getMonthLabel(module.start_month)} <span className="text-slate-300 mx-1">→</span> {getMonthLabel(module.end_month)}
                                        </span>
                                    </div>
                                </div>

                                {/* Titre */}
                                <h3 className={`
                                                text-lg font-bold mb-4 leading-tight 
                                                ${theme.text} opacity-50 group-hover:opacity-100 
                                                transition-opacity duration-300
                                            `}>
                                    {module.label}
                                </h3>

                                {/* Liste à puces stylisée */}
                                <div className="space-y-3 mb-6">
                                    {module.content && module.content.length > 0 ? (
                                        <ul className="space-y-2.5">
                                            {module.content.map((line, i) => (
                                                <li key={i} className="flex items-start text-sm text-slate-600">
                                                    {/* Puce personnalisée (Check ou point coloré) */}
                                                    <span className={`mt-1 mr-3 flex-shrink-0 ${theme.text}`}>
                                                        <CheckCircle2 className="w-4 h-4 opacity-80" /> {/* ou • */}
                                                    </span>
                                                    <span className="leading-relaxed opacity-90">{line}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-400 italic text-sm bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 text-center">
                                            Le contenu pédagogique sera bientôt disponible.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* --- Footer (Zone Livrables) - Séparée visuellement --- */}
                            {module.deliverables && module.deliverables.length > 0 && (
                                <div className="bg-slate-50/80 border-t border-slate-100 p-4 mt-auto backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`p-1.5 rounded-md ${theme.bg} bg-opacity-10`}>
                                            <Package className={`w-3.5 h-3.5 ${theme.text}`} /> {/* ou 📦 */}
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Livrables attendus
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        {module.deliverables.map((deliv, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm group/item hover:border-slate-300 transition-colors"
                                            >
                                                <span className="text-xs font-medium text-slate-700 truncate mr-2" title={deliv.descriptif}>
                                                    {deliv.descriptif}
                                                </span>

                                                {deliv.date && (
                                                    <div className="flex items-center gap-1 flex-shrink-0 bg-slate-100 px-2 py-1 rounded text-[10px] font-semibold text-slate-500">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(deliv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                    </div>
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