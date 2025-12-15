// src/pages/admin/AdminProgramsSection.jsx
import React, { useEffect } from "react";
import { usePrograms } from "../../hooks/usePrograms";
import ProgramSelector from "../../components/admin/ProgramSelector";
import ProgramViewer from "../../components/admin/ProgramViewer";

function AdminProgramsSection() {
    const {
        programs,
        loading,
        error: loadError,
        selectedProgram,
        selectProgram,
        refreshPrograms,
    } = usePrograms();

    // Optionnel : Sélectionner automatiquement le premier programme au chargement
    useEffect(() => {
        if (!loading && programs.length > 0 && !selectedProgram) {
            selectProgram(programs[0].key);
        }
    }, [loading, programs, selectedProgram, selectProgram]);

    // --- Gestion des états de chargement ---

    if (loading) {
        return (
            <div className="mt-8 py-12 text-center border-t border-slate-200">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-nws-purple"></div>
                <p className="mt-2 text-slate-500 text-sm">Chargement des programmes...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="mt-8 py-8 text-center border-t border-slate-200">
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg inline-block">
                    <p className="font-medium">Erreur de chargement</p>
                    <p className="text-sm opacity-80">{loadError}</p>
                </div>
                <button 
                    onClick={refreshPrograms}
                    className="block mx-auto mt-4 text-sm text-nws-purple hover:underline"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // --- Rendu Principal ---

    return (
        <section className="mt-8 pt-8 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* En-tête de section */}
            <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-slate-800">
                    Programmes
                </h2>
                <p className="text-slate-500 mt-1">
                    Gérez le contenu des programmes académiques via les onglets ci-dessous.
                </p>
            </div>

            {/* Zone de Contenu */}
            <div className="flex flex-col gap-6">
                
                {/* 1. Le Sélecteur (Onglets) */}
                <div className="w-full">
                    <ProgramSelector
                        programs={programs}
                        selectedKey={selectedProgram?.key}
                        onSelect={selectProgram}
                    />
                </div>

                {/* 2. Le Viewer (Contenu du programme sélectionné) */}
                <div className="min-h-[300px] bg-white rounded-2xl p-1 md:p-6">
                    {programs.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Aucun programme disponible pour le moment.
                        </div>
                    ) : selectedProgram ? (
                        <ProgramViewer
                            program={selectedProgram}
                        />
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            Sélectionnez un programme ci-dessus.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default AdminProgramsSection;