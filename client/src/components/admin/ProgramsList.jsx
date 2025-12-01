// src/components/admin/ProgramsList.jsx

function ProgramsList({ programs, selectedId, onSelect, onCreate }) {
    return (
        <div style={styles.sidebar}>
            <button style={styles.createButton} onClick={onCreate}>
                + Nouveau
            </button>

            {programs.length === 0 ? (
                <p style={styles.emptyText}>Aucun programme</p>
            ) : (
                <ul style={styles.list}>
                    {programs.map((program) => (
                        <ProgramItem
                            key={program.key}
                            program={program}
                            isActive={program.key === selectedId}
                            onClick={() => onSelect(program.key)}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

function ProgramItem({ program, isActive, onClick }) {
    const itemStyle = {
        ...styles.item,
        ...(isActive ? styles.activeItem : {}),
    };

    return (
        <li style={itemStyle} onClick={onClick}>
            {program.key} - {program.label || "(sans label)"}
        </li>
    );
}

const styles = {
    sidebar: {
        width: "250px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "0.8rem",
        padding: "0.75rem",
    },
    createButton: {
        width: "100%",
        marginBottom: "0.5rem",
        padding: "0.4rem",
        background: "#10b981",
        border: "none",
        borderRadius: "0.4rem",
        color: "white",
        cursor: "pointer",
        fontWeight: 500,
        transition: "background-color 0.2s",
    },
    list: {
        listStyle: "none",
        margin: 0,
        padding: 0,
    },
    item: {
        padding: "0.4rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        marginBottom: "0.3rem",
        fontSize: "0.9rem",
        transition: "background-color 0.15s",
    },
    activeItem: {
        background: "#e0f2fe",
        fontWeight: 500,
    },
    emptyText: {
        margin: 0,
        fontSize: "0.85rem",
        color: "#6b7280",
        textAlign: "center",
        padding: "1rem",
    },
};

export default ProgramsList;
