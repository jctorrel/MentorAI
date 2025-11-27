// src/hooks/useProgramEditor.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Nettoie un programme en retirant les champs techniques
 */
function cleanProgramForEdit(program) {
    if (!program) return "";
    
    const { createdAt, updatedAt, ...clean } = program;
    return JSON.stringify(clean, null, 2);
}

/**
 * Hook personnalisé pour gérer l'édition d'un programme
 * @param {Object} selectedProgram - Le programme sélectionné
 * @param {Function} onSave - Callback appelé après une sauvegarde réussie
 * @returns {Object} État et fonctions pour éditer le programme
 */
export function useProgramEditor(selectedProgram, onSave) {
    const [jsonText, setJsonText] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState(null);

    // Mettre à jour le JSON quand le programme sélectionné change
    useEffect(() => {
        if (selectedProgram) {
            setJsonText(cleanProgramForEdit(selectedProgram));
            // Réinitialiser les messages
            setSaveMessage("");
            setError(null);
        } else {
            setJsonText("");
        }
    }, [selectedProgram]);

    /**
     * Met à jour le texte JSON
     */
    const updateJsonText = (text) => {
        setJsonText(text);
        // Réinitialiser les messages lors de la modification
        setSaveMessage("");
        setError(null);
    };

    /**
     * Valide le JSON
     */
    const validateJson = () => {
        if (!selectedProgram?.id) {
            setError("Aucun programme sélectionné");
            return null;
        }

        try {
            const parsed = JSON.parse(jsonText);
            return parsed;
        } catch (err) {
            setError("JSON invalide : " + err.message);
            return null;
        }
    };

    /**
     * Sauvegarde le programme
     */
    const save = async () => {
        const parsed = validateJson();
        if (!parsed) return;

        setSaving(true);
        setError(null);
        setSaveMessage("");

        try {
            await apiFetch(`/api/admin/programs/${selectedProgram.id}`, {
                method: "PUT",
                body: JSON.stringify(parsed),
            });

            setSaveMessage("Programme sauvegardé ✔");
            
            // Auto-clear le message après 3 secondes
            setTimeout(() => setSaveMessage(""), 3000);

            // Notifier le parent pour rafraîchir la liste
            if (onSave) {
                await onSave();
            }
        } catch (err) {
            setError(err?.message || "Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    return {
        jsonText,
        saving,
        saveMessage,
        error,
        updateJsonText,
        save,
    };
}
