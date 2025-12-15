// src/components/admin/AdminFreeModeSection.jsx
import React, { useState, useEffect } from "react";
import { MessageSquare, Unlock, Lock, CheckCircle2 } from "lucide-react";

function AdminFreeModeSection() {
    const [freeModeEnabled, setFreeModeEnabled] = useState(true);
    const [saveStatus, setSaveStatus] = useState("");

    // Charger la configuration au montage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("mentor_admin_settings");
            if (stored) {
                const settings = JSON.parse(stored);
                setFreeModeEnabled(settings.freeModeEnabled ?? true);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des paramètres:", error);
        }
    }, []);

    // Sauvegarder la configuration
    const handleToggle = () => {
        const newValue = !freeModeEnabled;
        setFreeModeEnabled(newValue);

        try {
            // Simulation de sauvegarde locale (à remplacer par un appel API si besoin)
            const currentSettings = JSON.parse(localStorage.getItem("mentor_admin_settings") || "{}");
            const settings = { ...currentSettings, freeModeEnabled: newValue };
            
            localStorage.setItem("mentor_admin_settings", JSON.stringify(settings));
            
            setSaveStatus("Sauvegardé");
            setTimeout(() => setSaveStatus(""), 2000);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-8">
            
            {/* --- En-tête de la carte --- */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3">
                    <div className={`p-2 rounded-lg border shadow-sm ${freeModeEnabled ? 'bg-nws-purple/10 border-nws-purple/20 text-nws-purple' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Mode Discussion Libre
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xl">
                            Autoriser les étudiants à poser des questions hors contexte, sans suivre un module spécifique du programme.
                        </p>
                    </div>
                </div>

                {/* Indicateur de sauvegarde */}
                {saveStatus && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full border border-green-200 animate-in fade-in slide-in-from-right-4">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {saveStatus}
                    </div>
                )}
            </div>

            {/* --- Zone de contrôle --- */}
            <div className={`
                flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                ${freeModeEnabled 
                    ? 'bg-slate-50 border-slate-200' 
                    : 'bg-slate-50/50 border-dashed border-slate-200'
                }
            `}>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        {freeModeEnabled ? (
                            <>
                                <Unlock className="w-4 h-4 text-green-600" />
                                <span className="text-green-700">Fonctionnalité Active</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-500">Fonctionnalité Désactivée</span>
                            </>
                        )}
                    </span>
                    <span className="text-xs text-slate-500">
                        {freeModeEnabled 
                            ? "Les étudiants ont accès à l'onglet « Discussion Libre »."
                            : "L'onglet est masqué. Seul le mode guidé est accessible."
                        }
                    </span>
                </div>
                
                {/* Switch Button */}
                <button
                    onClick={handleToggle}
                    className={`
                        relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nws-purple
                        ${freeModeEnabled ? 'bg-nws-purple' : 'bg-slate-300 hover:bg-slate-400'}
                    `}
                    aria-label={freeModeEnabled ? "Désactiver le mode libre" : "Activer le mode libre"}
                >
                    <span
                        className={`
                            absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center
                            ${freeModeEnabled ? 'translate-x-6' : 'translate-x-0'}
                        `}
                    >
                         {/* Petit point visuel au centre du bouton */}
                         <div className={`w-1.5 h-1.5 rounded-full transition-colors ${freeModeEnabled ? 'bg-nws-purple' : 'bg-slate-300'}`} />
                    </span>
                </button>
            </div>

            {/* --- Feedback Visuel (Info Box) --- */}
            <div className={`
                grid transition-all duration-500 ease-in-out overflow-hidden
                ${freeModeEnabled ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}
            `}>
                <div className="min-h-0 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <div className="text-blue-500 mt-0.5">ℹ️</div>
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Impact sur l'interface étudiant :</p>
                        <ul className="list-disc list-inside space-y-0.5 opacity-80">
                            <li>L'étudiant verra un sélecteur de mode en haut de son chat.</li>
                            <li>Le contexte des modules en cours ne sera pas contraint.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AdminFreeModeSection;