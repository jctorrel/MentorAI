// src/pages/admin/AdminProgramsSection.jsx
import { useState } from "react";
import { usePrograms } from "../../hooks/usePrograms";
import { useProgramEditor } from "../../hooks/useProgramEditor";
import ProgramsList from "../../components/admin/ProgramsList";
import ProgramEditor from "../../components/admin/ProgramEditor";

function AdminProgramsSection() {
    const [actionError, setActionError] = useState(null);

    const {
        programs,
        loading,
        error: loadError,
        selectedProgram,
        selectProgram,
        createProgram,
        deleteProgram,
        refreshPrograms,
    } = usePrograms();

    const {
        jsonText,
        saving,
        saveMessage,
        error: saveError,
        updateJsonText,
        save,
    } = useProgramEditor(selectedProgram, refreshPrograms);

    /**
     * Gère la création d'un nouveau programme
     */
    const handleCreate = async () => {
        setActionError(null);

        const id = prompt("ID du nouveau programme (ex: A2, B1…) :");
        if (!id) return;

        try {
            await createProgram(id.trim());
        } catch (error) {
            setActionError(error.message);
        }
    };

    /**
     * Gère la suppression d'un programme
     */
    const handleDelete = async (programId) => {
        setActionError(null);

        try {
            await deleteProgram(programId);
        } catch (error) {
            setActionError(error.message);
        }
    };

    if (loading) {
        return (
            <section style={styles.section}>
                <h2 style={styles.title}>Programmes</h2>
                <p style={styles.loadingText}>Chargement…</p>
            </section>
        );
    }

    // Afficher l'erreur de chargement
    if (loadError) {
        return (
            <section style={styles.section}>
                <h2 style={styles.title}>Programmes</h2>
                <p style={styles.errorText}>{loadError}</p>
            </section>
        );
    }

    // Combiner les erreurs d'action et de sauvegarde
    const displayError = actionError || saveError;

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>Programmes</h2>
            <p style={styles.help}>
                Sélectionne un programme dans la liste, édite son JSON, puis sauvegarde.
            </p>

            {displayError && <p style={styles.errorText}>{displayError}</p>}
            {saveMessage && <p style={styles.successText}>{saveMessage}</p>}

            <div style={styles.layout}>
                <ProgramsList
                    programs={programs}
                    selectedId={selectedProgram?.id}
                    onSelect={selectProgram}
                    onCreate={handleCreate}
                />

                <ProgramEditor
                    selectedProgram={selectedProgram}
                    jsonText={jsonText}
                    saving={saving}
                    saveMessage={saveMessage}
                    error={saveError}
                    onJsonChange={updateJsonText}
                    onSave={save}
                    onDelete={handleDelete}
                />
            </div>
        </section>
    );
}

const styles = {
    section: {
        marginTop: "1.5rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e7eb",
    },
    title: {
        margin: 0,
        marginBottom: "0.5rem",
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    help: {
        marginTop: 0,
        marginBottom: "1rem",
        fontSize: "0.9rem",
        color: "#6b7280",
    },
    layout: {
        display: "flex",
        gap: "1rem",
        alignItems: "stretch",
    },
    loadingText: {
        fontSize: "0.9rem",
        color: "#64748b",
    },
    errorText: {
        fontSize: "0.9rem",
        color: "#dc2626",
        marginTop: "0.5rem",
    },
    successText: {
        fontSize: "0.9rem",
        color: "#16a34a",
        marginTop: "0.5rem",
    },
};

export default AdminProgramsSection;
