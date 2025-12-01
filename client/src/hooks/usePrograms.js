// src/hooks/usePrograms.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour gérer la liste des programmes
 * @returns {Object} État et fonctions pour gérer les programmes
 */
export function usePrograms() {
    const [state, setState] = useState({
        programs: [],
        loading: true,
        error: null,
        selectedProgram: null,
    });

    // Charger la liste des programmes au montage
    useEffect(() => {
        loadPrograms();
    }, []);

    /**
     * Charge la liste des programmes depuis l'API
     */
    const loadPrograms = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const list = await apiFetch("/api/admin/programs");
            
            setState(prev => ({
                ...prev,
                programs: list,
                loading: false,
                // Sélectionner le premier programme par défaut
                selectedProgram: list.length > 0 ? list[0] : null,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                programs: [],
                loading: false,
                error: error?.message || "Erreur lors du chargement des programmes",
                selectedProgram: null,
            }));
        }
    };

    /**
     * Sélectionne un programme par son ID
     */
    const selectProgram = (key) => {
        const program = state.programs.find((p) => p.key === key);
        if (program) {
            setState(prev => ({
                ...prev,
                selectedProgram: program,
            }));
        }
    };

    /**
     * Crée un nouveau programme
     */
    const createProgram = async (key) => {
        if (!key || !key.trim()) {
            throw new Error("L'ID du programme est requis");
        }

        try {
            await apiFetch(`/api/admin/programs/${key}`, {
                method: "PUT",
                body: JSON.stringify({
                    key,
                    label: "",
                    objectives: "",
                    level: "",
                    resources: [],
                    modules: [],
                }),
            });

            // Recharger la liste et sélectionner le nouveau programme
            await loadPrograms();
            selectProgram(key);
        } catch (error) {
            throw new Error(
                error?.message || "Impossible de créer le programme"
            );
        }
    };

    /**
     * Supprime un programme
     */
    const deleteProgram = async (key) => {
        if (!key) {
            throw new Error("Aucun programme sélectionné");
        }

        try {
            await apiFetch(`/api/admin/programs/${key}`, {
                method: "DELETE",
            });

            // Recharger la liste
            await loadPrograms();
            
            // Déselectionner
            setState(prev => ({
                ...prev,
                selectedProgram: null,
            }));
        } catch (error) {
            throw new Error(
                error?.message || "Impossible de supprimer le programme"
            );
        }
    };

    /**
     * Met à jour un programme dans la liste après sauvegarde
     */
    const refreshPrograms = async () => {
        try {
            const list = await apiFetch("/api/admin/programs");
            setState(prev => ({
                ...prev,
                programs: list,
            }));
        } catch (error) {
            console.error("Erreur lors du rafraîchissement:", error);
        }
    };

    return {
        programs: state.programs,
        loading: state.loading,
        error: state.error,
        selectedProgram: state.selectedProgram,
        selectProgram,
        createProgram,
        deleteProgram,
        refreshPrograms,
    };
}
