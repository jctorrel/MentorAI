import React from 'react';
import { Save, Terminal, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ErrorMessage, SuccessMessage } from "./AdminStatus";

function PromptEditor({ form, saving, saveMessage, error, onFieldChange, onSave }) {

    // --- État vide (Aucun prompt sélectionné) ---
    if (!form.key) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 p-8">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Terminal className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium text-lg">Aucun prompt sélectionné</p>
                <p className="text-sm mt-1">Cliquez sur un élément à gauche pour commencer l'édition.</p>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFieldChange(name, value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            
            {/* --- En-tête --- */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-nws-purple" />
                        Éditeur de Prompt
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clé système :</span>
                        <code className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-mono">
                            {form.key}
                        </code>
                    </div>
                </div>
            </div>

            {/* --- Messages de statut --- */}
            <div className="px-6 pt-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}
                {saveMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2 text-sm border border-green-100">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        {saveMessage}
                    </div>
                )}
                {/* Fallback si tu utilises tes composants existants qui ont leur propre style */}
                {!error && !saveMessage && (
                    <>
                        <ErrorMessage message={error} />
                        <SuccessMessage message={saveMessage} />
                    </>
                )}
            </div>

            {/* --- Formulaire --- */}
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col px-6 pb-6">
                
                <div className="flex flex-col gap-6 h-full">
                    {/* Champ Contenu (Zone principale) */}
                    <div className="flex-grow flex flex-col min-h-[300px]">
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="content" className="block text-sm font-semibold text-slate-700">
                                Contenu du prompt
                            </label>
                            <span className="text-xs text-slate-400 font-medium">Syntaxe Markdown supportée</span>
                        </div>
                        
                        <div className="relative flex-grow">
                            <textarea
                                id="content"
                                name="content"
                                value={form.content || ''}
                                onChange={handleChange}
                                spellCheck={false}
                                placeholder="Entrez les instructions système ici..."
                                className="w-full h-full min-h-[300px] p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-nws-purple/20 focus:border-nws-purple transition-all shadow-inner"
                            />
                        </div>
                        
                        {/* Aide Contextuelle */}
                        <div className="mt-2 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-2 rounded-lg border border-blue-100">
                            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <p>
                                Utilisez la syntaxe <code className="bg-white px-1 py-0.5 rounded border border-blue-200 text-blue-600 font-bold">{'{{variable}}'}</code> pour insérer des données dynamiques.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Barre d'action --- */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
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
                                Sauvegarder les modifications
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default PromptEditor;