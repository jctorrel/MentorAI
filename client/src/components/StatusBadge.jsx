// client/src/components/StatusBadge.jsx
import React from 'react';
import { Wifi, Zap, AlertCircle } from 'lucide-react';

function StatusBadge({ online, count = 0, limit = 50 }) {
    // Calcul du pourcentage d'utilisation pour la couleur
    const percentage = Math.min((count / limit) * 100, 100);
    
    // Couleur dynamique selon l'utilisation
    let limitColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (percentage > 75) limitColor = "text-amber-600 bg-amber-50 border-amber-200";
    if (percentage >= 100) limitColor = "text-red-600 bg-red-50 border-red-200";

    return (
        <div className="flex items-center gap-3">
            {/* Indicateur de Quota (Tokens) */}
            <div 
                className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${limitColor}`}
                title="Messages utilisés dans cette session"
            >
                <Zap size={12} className={percentage >= 100 ? "fill-current" : ""} />
                <span>{count} / {limit}</span>
            </div>

            {/* Indicateur de Connexion */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                online 
                    ? "bg-slate-50 border-slate-200 text-slate-600" 
                    : "bg-red-50 border-red-200 text-red-600"
            }`}>
                <div className="relative flex h-2 w-2">
                    {online && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${online ? "bg-green-500" : "bg-red-500"}`}></span>
                </div>
                <span className="hidden md:inline">
                    {online ? "Système Opérationnel" : "Déconnecté"}
                </span>
                <span className="md:hidden">
                    {online ? "En ligne" : "Hors ligne"}
                </span>
            </div>
        </div>
    );
}

export default StatusBadge;