// src/pages/admin/AdminPromptsSection.jsx
import React, { useEffect } from "react";
import { usePrompts } from "../../hooks/usePrompts";
import { usePromptEditor } from "../../hooks/usePromptEditor";
import PromptsList from "../../components/admin/PromptsList";
import PromptEditor from "../../components/admin/PromptEditor";

function AdminPromptsSection() {
    const {
        prompts,
        loading,
        error: loadError,
        selectedPrompt,
        selectPrompt,
        updatePrompt,
        refreshPrompts // Supposons que tu aies une fonction refresh dans ton hook
    } = usePrompts();

    const {
        form,
        saving,
        saveMessage,
        error: saveError,
        updateField,
        save,
    } = usePromptEditor(selectedPrompt, updatePrompt);

    // UX : Sélectionner automatiquement le premier prompt au chargement
    useEffect(() => {
        if (!loading && prompts.length > 0 && !selectedPrompt) {
            selectPrompt(prompts[0].key);
        }
    }, [loading, prompts, selectedPrompt, selectPrompt]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="mt-8 py-12 text-center border-t border-slate-200">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-nws-purple"></div>
                <p className="mt-2 text-slate-500 text-sm">Chargement de la configuration...</p>
            </div>
        );
    }

    // --- Error State ---
    if (loadError) {
        return (
            <div className="mt-8 py-8 text-center border-t border-slate-200">
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg inline-block border border-red-100">
                    <p className="font-bold">Erreur de chargement</p>
                    <p className="text-sm opacity-90">{loadError}</p>
                </div>
                {refreshPrompts && (
                    <button 
                        onClick={refreshPrompts}
                        className="block mx-auto mt-4 text-sm text-nws-purple hover:underline"
                    >
                        Réessayer
                    </button>
                )}
            </div>
        );
    }

    // --- Main Layout ---
    return (
        <section className="mt-8 pt-8 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-500">

            {/* Layout Master-Detail (Liste | Éditeur) */}
            <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-250px)] min-h-[600px]">
                
                {/* Colonne Gauche : Liste (Largeur fixe sur Desktop) */}
                <div className="w-full md:w-72 flex-shrink-0 h-full">
                    <PromptsList
                        prompts={prompts}
                        selectedKey={selectedPrompt?.key}
                        onSelect={selectPrompt}
                    />
                </div>

                {/* Colonne Droite : Éditeur (Prend le reste de l'espace) */}
                <div className="flex-1 h-full min-w-0">
                    <PromptEditor
                        form={form}
                        saving={saving}
                        saveMessage={saveMessage}
                        error={saveError}
                        onFieldChange={updateField}
                        onSave={save}
                    />
                </div>
            </div>

        </section>
    );
}

export default AdminPromptsSection;