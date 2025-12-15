// client/src/components/QuickActions.jsx
import React from "react";
import { BookOpen, Sparkles, Code2, Terminal, PenTool, Hash } from "lucide-react";

function QuickActions({ modules, onModuleClick }) {
    if (!modules || modules.length === 0) return null;

    // Fonction pour obtenir une icône et une couleur "au pif" mais cohérente pour chaque module
    // pour éviter que tout soit gris.
    const getModuleStyle = (index) => {
        const styles = [
            { color: "text-purple-600", bg: "bg-purple-50", border: "hover:border-purple-200", icon: Code2 },
            { color: "text-teal-600", bg: "bg-teal-50", border: "hover:border-teal-200", icon: Terminal },
            { color: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-200", icon: PenTool },
            { color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-200", icon: Hash },
        ];
        return styles[index % styles.length];
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Header de la section */}
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                    Sur quel sujet voulez-vous <br className="hidden sm:block"/> 
                    travailler aujourd'hui ?
                </h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto">
                    Sélectionnez un module pour activer le contexte spécifique du mentor.
                </p>
            </div>

            {/* Grille de cartes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module, index) => {
                    const style = getModuleStyle(index);
                    const Icon = style.icon;

                    return (
                        <button
                            key={index}
                            onClick={() => onModuleClick(module)}
                            className={`
                                group relative flex flex-col items-start p-6 h-full
                                bg-white rounded-2xl border border-slate-100 shadow-sm
                                transition-all duration-300 ease-out
                                hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1
                                ${style.border}
                            `}
                        >
                            {/* Décoration d'arrière-plan au survol */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white via-white to-${style.bg.split('-')[1]}-50/30`} />

                            {/* En-tête de la carte : Icône */}
                            <div className={`
                                relative mb-4 w-12 h-12 rounded-xl flex items-center justify-center
                                ${style.bg} ${style.color}
                                group-hover:scale-110 transition-transform duration-300
                            `}>
                                <Icon size={24} strokeWidth={1.5} />
                            </div>

                            {/* Contenu */}
                            <div className="relative text-left w-full">
                                <h3 className="font-bold text-slate-800 text-[15px] mb-1 group-hover:text-nws-purple transition-colors">
                                    {module.label}
                                </h3>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    Lancez une session interactive sur ce module pour obtenir de l'aide ciblée.
                                </p>
                            </div>

                            {/* Indicateur visuel "Go" (flèche en bas à droite) */}
                            <div className="absolute bottom-5 right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-300">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default QuickActions;