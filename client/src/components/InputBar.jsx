// client/src/components/InputBar.jsx
import React from "react";
import { Send, Loader2 } from "lucide-react";

function InputBar({ 
    value, 
    onChange, 
    onSubmit, 
    disabled, 
    shouldShowModules, 
    placeholder = "Posez votre question au mentor..." 
}) {
    
    // Si on doit choisir un module, on cache la barre de saisie
    if (shouldShowModules) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!disabled && value.trim()) {
            onSubmit(e);
        }
    };

    return (
        <div className="p-4 bg-white border-t border-slate-100">
            <form
                onSubmit={handleSubmit}
                className="relative max-w-4xl mx-auto flex items-center"
            >
                {/* Champ de saisie */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus
                    className="
                        w-full pl-5 pr-14 py-3.5 
                        bg-slate-50 border border-slate-200 
                        rounded-2xl text-sm text-slate-800 placeholder:text-slate-400
                        outline-none transition-all duration-200
                        focus:bg-white focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10
                        disabled:opacity-60 disabled:cursor-not-allowed
                        shadow-sm
                    "
                />

                {/* Bouton d'envoi (Positionné en absolu à droite) */}
                <button
                    type="submit"
                    disabled={disabled || !value.trim()}
                    className={`
                        absolute right-2 p-2 rounded-xl flex items-center justify-center transition-all duration-200
                        ${disabled || !value.trim() 
                            ? "bg-transparent text-slate-300 cursor-not-allowed" 
                            : "bg-nws-purple text-white hover:bg-nws-purple/90 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        }
                    `}
                >
                    {disabled && value.trim() ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} className={value.trim() && !disabled ? "ml-0.5" : ""} />
                    )}
                </button>
            </form>
            
            {/* Petit texte d'aide optionnel en dessous */}
            <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">
                    L'IA peut faire des erreurs. Vérifiez les informations importantes.
                </p>
            </div>
        </div>
    );
}

export default InputBar;