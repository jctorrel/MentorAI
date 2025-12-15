// client/src/components/HelperBar.jsx
import React from "react";
import { UserCircle2, Lightbulb, Sparkles, BookOpen } from "lucide-react";

function HelperBar({ studentEmail, mode = "guided" }) {
    const isFreeMode = mode === "free";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
            
            {/* Partie Gauche : Identité Utilisateur */}
            <div className="flex items-center gap-2">
                <UserCircle2 size={14} className="text-slate-400" />
                <span className="opacity-70">Connecté en tant que</span>
                <span className="font-semibold text-nws-purple truncate max-w-[200px]" title={studentEmail}>
                    {studentEmail}
                </span>
            </div>

            {/* Partie Droite : Mode & Indication */}
            <div className={`
                flex items-center gap-1.5 px-2 py-0.5 rounded-full border w-fit
                ${isFreeMode 
                    ? "bg-purple-50 border-purple-100 text-purple-700" 
                    : "bg-blue-50 border-blue-100 text-blue-700"
                }
            `}>
                {isFreeMode ? <Sparkles size={12} /> : <BookOpen size={12} />}
                
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                    {isFreeMode ? "Mode Libre" : "Mode Guidé"}
                </span>
                
                <span className="w-px h-3 bg-current opacity-20 mx-1"></span>
                
                <div className="flex items-center gap-1 opacity-90">
                    <Lightbulb size={10} className="mb-0.5" />
                    <span>
                        {isFreeMode 
                            ? "Posez vos questions librement" 
                            : "Sélectionnez un module pour démarrer la discussion"
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}

export default HelperBar;