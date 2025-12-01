// src/components/admin/ProgramEditor.jsx
import { ErrorMessage, SuccessMessage } from "./AdminStatus";

function ProgramEditor({
    selectedProgram,
    jsonText,
    saving,
    saveMessage,
    error,
    onJsonChange,
    onSave,
    onDelete,
}) {
    if (!selectedProgram) {
        return (
            <div style={styles.editor}>
                <p style={styles.emptyText}>
                    Sélectionne un programme dans la liste pour l'éditer
                </p>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    const handleDelete = () => {
        if (window.confirm("Supprimer ce programme ?")) {
            onDelete(selectedProgram.key);
        }
    };

    return (
        <div style={styles.editor}>
            <h3 style={styles.editorTitle}>
                Programme : <code>{selectedProgram.key}</code>
            </h3>

            <ErrorMessage message={error} />
            <SuccessMessage message={saveMessage} />

            <form onSubmit={handleSubmit}>
                <textarea
                    value={jsonText}
                    onChange={(e) => onJsonChange(e.target.value)}
                    style={styles.textarea}
                    rows={20}
                    placeholder='{"key": "A1", "label": "Programme A1", ...}'
                    spellCheck={false}
                />

                <p style={styles.hint}>
                    Format JSON. Les champs <code>createdAt</code> et{" "}
                    <code>updatedAt</code> sont automatiquement gérés.
                </p>

                <div style={styles.buttons}>
                    <button
                        type="submit"
                        style={{
                            ...styles.saveButton,
                            ...(saving ? styles.buttonDisabled : {}),
                        }}
                        disabled={saving}
                    >
                        {saving ? "Sauvegarde…" : "Sauvegarder"}
                    </button>

                    <button
                        type="button"
                        style={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={saving}
                    >
                        Supprimer
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    editor: {
        flex: 1,
        border: "1px solid #e5e7eb",
        padding: "1rem",
        borderRadius: "0.8rem",
        background: "white",
    },
    editorTitle: {
        marginTop: 0,
        marginBottom: "1rem",
        fontSize: "1rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    textarea: {
        width: "100%",
        fontFamily: "monospace",
        padding: "0.6rem",
        borderRadius: "0.5rem",
        border: "1px solid #d1d5db",
        fontSize: "0.85rem",
        lineHeight: 1.5,
        resize: "vertical",
    },
    hint: {
        margin: "0.5rem 0",
        fontSize: "0.8rem",
        color: "#6b7280",
    },
    buttons: {
        marginTop: "1rem",
        display: "flex",
        gap: "1rem",
    },
    saveButton: {
        padding: "0.5rem 1rem",
        background: "#2563eb",
        color: "white",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
        fontWeight: 500,
        transition: "background-color 0.2s, opacity 0.2s",
    },
    deleteButton: {
        padding: "0.5rem 1rem",
        background: "#dc2626",
        color: "white",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
        fontWeight: 500,
        transition: "background-color 0.2s",
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
    emptyText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "0.95rem",
        padding: "2rem",
    },
};

export default ProgramEditor;
