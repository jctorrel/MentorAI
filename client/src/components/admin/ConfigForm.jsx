// src/components/admin/ConfigForm.jsx
import React, { useState, useEffect } from 'react';
import { Save, Settings, AlertCircle, RefreshCw, School, Mic, ScrollText, CheckCircle2 } from 'lucide-react';
import { apiFetch } from "../../utils/api";

function ConfigForm({ config, saving, saveMessage, error, onFieldChange, onSave }) {
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // Charger la configuration au montage
    useEffect(() => {
        const loadConfig = async () => {
            setLoading(true);
            setLoadError(null);
            
            try {
                const data = await apiFetch('/api/admin/config', { method: 'GET' });

                if (!data) {
                    throw new Error(`Erreur lors de la récupération des données`);
                }

                Object.keys(data).forEach(key => {
                    if (data[key] !== undefined) {
                        onFieldChange(key, data[key]);
                    }
                });
            } catch (err) {
                console.error('Erreur lors du chargement de la configuration:', err);
                setLoadError(err.message || 'Impossible de charger la configuration');
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, []); 

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFieldChange(name, value);
    };

    // --- État de chargement initial ---
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nws-purple mb-4"></div>
                <p className="text-slate-500 font-medium">Chargement des paramètres...</p>
            </div>
        );
    }

    // --- État d'erreur de chargement ---
    if (loadError) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Erreur de connexion</h3>
                <p className="text-slate-500 mb-6">{loadError}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 transition-colors shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Recharger la page
                </button>
            </div>
        );
    }

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* --- En-tête --- */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <Settings className="w-5 h-5 text-nws-purple" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Configuration Générale</h2>
                        <p className="text-sm text-slate-500">Définissez l'identité et les règles globales du mentor. <strong>Keep It Simple</strong></p>
                    </div>
                </div>
            </div>

            {/* --- Formulaire --- */}
            <form onSubmit={handleSubmit} className="p-6">
                
                {/* Messages de succès/erreur lors de la sauvegarde */}
                <div className="mb-6 space-y-3">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100 animate-in slide-in-from-top-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    {saveMessage && (
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2 text-sm border border-green-100 animate-in slide-in-from-top-2">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            {saveMessage}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    
                    {/* Grille pour les champs courts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Nom de l'école */}
                        <div className="space-y-2">
                            <label htmlFor="school_name" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <School className="w-4 h-4 text-slate-400" />
                                Nom de l'école
                            </label>
                            <input
                                id="school_name"
                                name="school_name"
                                type="text"
                                value={config.school_name || ''}
                                onChange={handleChange}
                                placeholder="Ex: Normandie Web School"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-nws-purple/20 focus:border-nws-purple transition-all"
                            />
                        </div>

                        {/* Tonalité */}
                        <div className="space-y-2">
                            <label htmlFor="tone" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Mic className="w-4 h-4 text-slate-400" />
                                Tonalité du mentor
                            </label>
                            <div className="relative">
                                <input
                                    id="tone"
                                    name="tone"
                                    type="text"
                                    value={config.tone || ''}
                                    onChange={handleChange}
                                    placeholder="Ex: Professionnel, encourageant..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-nws-purple/20 focus:border-nws-purple transition-all"
                                />
                            </div>
                            <p className="text-xs text-slate-400 pl-1">Définit la "personnalité" de l'IA dans ses réponses.</p>
                        </div>
                    </div>

                    {/* Règles Globales */}
                    <div className="space-y-2">
                        <label htmlFor="rules" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <ScrollText className="w-4 h-4 text-slate-400" />
                            Règles Globales (System Prompt)
                        </label>
                        <textarea
                            id="rules"
                            name="rules"
                            rows={5}
                            value={config.rules || ''}
                            onChange={handleChange}
                            placeholder="Définissez ici les contraintes absolues (ex: ne jamais donner la réponse directe, toujours répondre en français...)"
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-nws-purple/20 focus:border-nws-purple transition-all"
                        />
                        <p className="text-xs text-slate-400 pl-1">Ces règles seront injectées dans le contexte de toutes les conversations.</p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                                ${saving 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                    : 'bg-nws-purple text-white shadow-button hover:shadow-lg hover:-translate-y-0.5'
                                }
                            `}
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Sauvegarder la configuration
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </form>
        </section>
    );
}

export default ConfigForm;