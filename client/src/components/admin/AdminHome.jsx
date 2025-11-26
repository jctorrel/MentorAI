// src/pages/AdminHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api"; 

function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState({
    school_name: "",
    tone: "",
    rules: "",
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const navigate = useNavigate();

  // Récupérer user pour l'affichage
  let currentUserEmail = "";
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const user = JSON.parse(raw);
      currentUserEmail = user?.email || "";
    }
  } catch {
    // ignore
  }

  useEffect(() => {
    let cancelled = false;

    async function checkAdminAndLoadConfig() {
      setLoading(true);
      setError("");
      setSaveMessage("");

      try {
        // ✅ Sert à la fois de check admin ET de chargement de la config
        const cfg = await apiFetch("/api/admin/config");
        if (cancelled) return;

        setConfig({
          school_name: cfg.school_name || "",
          tone: cfg.tone || "",
          rules: cfg.rules || "",
        });
        setIsAdmin(true);
      } catch (e) {
        if (cancelled) return;

        const msg = e?.message || "Erreur d'accès à l'administration";
        setError(msg);

        if (msg === "not_authorized") {
          setIsAdmin(false);
        } else {
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkAdminAndLoadConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleConfigSave(e) {
    e.preventDefault();
    setSavingConfig(true);
    setSaveMessage("");
    setError("");

    try {
      const body = {
        school_name: config.school_name,
        tone: config.tone,
        rules: config.rules,
      };

      const saved = await apiFetch("/api/admin/config", {
        method: "PUT",
        body: JSON.stringify(body),
      });

      setConfig({
        school_name: saved.school_name,
        tone: saved.tone,
        rules: saved.rules,
      });

      setSaveMessage("Configuration sauvegardée ✔");
    } catch (e) {
      setError(e?.message || "Erreur lors de la sauvegarde de la config");
    } finally {
      setSavingConfig(false);
    }
  }

  function handleConfigFieldChange(e) {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Administration</h1>
            <p style={styles.subtitle}>
              Interface de gestion du mentor IA (config + prompts + programmes)
            </p>
          </div>
          {currentUserEmail && (
            <div style={styles.userBadge}>
              <span style={styles.userLabel}>Connecté :</span>
              <span style={styles.userEmail}>{currentUserEmail}</span>
            </div>
          )}
        </header>

        {loading && <p style={styles.info}>Vérification des droits…</p>}

        {!loading && !isAdmin && (
          <div style={styles.errorBox}>
            <p style={styles.errorTitle}>Accès refusé</p>
            <p style={styles.errorText}>
              Votre compte n’est pas autorisé à accéder à l’administration.
            </p>
            <button style={styles.buttonSecondary} onClick={() => navigate("/")}>
              ← Retour à l’application
            </button>
          </div>
        )}

        {!loading && isAdmin && (
          <>
            {error && (
              <p style={styles.errorTextSmall}>
                Une erreur est survenue : {error}
              </p>
            )}

            {/* SECTION CONFIG GÉNÉRALE */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Configuration générale</h2>
              <p style={styles.sectionHelp}>
                Paramètres globaux utilisés par le mentor (nom de l’école,
                tonalité des réponses, règles de sécurité…).
              </p>

              <form style={styles.form} onSubmit={handleConfigSave}>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="school_name">
                    Nom de l’école
                  </label>
                  <input
                    id="school_name"
                    name="school_name"
                    type="text"
                    value={config.school_name}
                    onChange={handleConfigFieldChange}
                    style={styles.input}
                    placeholder="Normandie Web School"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label} htmlFor="tone">
                    Tonalité du mentor
                  </label>
                  <input
                    id="tone"
                    name="tone"
                    type="text"
                    value={config.tone}
                    onChange={handleConfigFieldChange}
                    style={styles.input}
                    placeholder="concis, professionnel, bienveillant…"
                  />
                  <p style={styles.fieldHint}>
                    Par exemple : <em>“concis, professionnel”</em>
                  </p>
                </div>

                <div style={styles.field}>
                  <label style={styles.label} htmlFor="rules">
                    Règles globales
                  </label>
                  <textarea
                    id="rules"
                    name="rules"
                    value={config.rules}
                    onChange={handleConfigFieldChange}
                    style={styles.textarea}
                    rows={4}
                    placeholder="jamais quitter école, escalade humaine si détresse…"
                  />
                  <p style={styles.fieldHint}>
                    Tu peux préciser les contraintes de sécurité, la gestion des
                    cas sensibles, etc.
                  </p>
                </div>

                <div style={styles.actions}>
                  <button
                    type="submit"
                    style={styles.buttonPrimary}
                    disabled={savingConfig}
                  >
                    {savingConfig ? "Sauvegarde…" : "Sauvegarder la config"}
                  </button>
                  <button
                    type="button"
                    style={styles.buttonSecondary}
                    onClick={() => navigate("/")}
                  >
                    ← Retour à l’application
                  </button>
                </div>

                {saveMessage && (
                  <p style={styles.successText}>{saveMessage}</p>
                )}
              </form>
            </section>

            {/* SECTION PROMPTS & PROGRAMMES (placeholders pour la suite) */}
            <section style={styles.sectionMuted}>
              <h2 style={styles.sectionTitle}>Prompts</h2>
              <p style={styles.sectionHelp}>
                Cette section permettra de gérer les prompts du mentor
                directement depuis l’interface (à implémenter).
              </p>
            </section>

            <section style={styles.sectionMuted}>
              <h2 style={styles.sectionTitle}>Programmes</h2>
              <p style={styles.sectionHelp}>
                Cette section permettra de gérer les programmes, modules et
                contenus pédagogiques (à implémenter).
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top, #e0f2fe 0, #f8fafc 40%, #e5e7eb 100%)",
    padding: "1rem",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1.5rem",
    padding: "2rem",
    maxWidth: "900px",
    width: "100%",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    marginTop: "0.25rem",
    fontSize: "0.95rem",
    color: "#6b7280",
  },
  userBadge: {
    padding: "0.5rem 0.75rem",
    borderRadius: "999px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  userLabel: {
    fontSize: "0.7rem",
    color: "#94a3b8",
  },
  userEmail: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  info: {
    fontSize: "0.9rem",
    color: "#64748b",
  },
  errorBox: {
    borderRadius: "1rem",
    padding: "1rem 1.25rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    marginTop: "0.5rem",
    marginBottom: "1rem",
  },
  errorTitle: {
    margin: 0,
    fontWeight: 600,
    color: "#b91c1c",
    marginBottom: "0.25rem",
  },
  errorText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#991b1b",
    marginBottom: "0.75rem",
  },
  errorTextSmall: {
    marginTop: "0.5rem",
    fontSize: "0.8rem",
    color: "#ef4444",
  },
  successText: {
    marginTop: "0.5rem",
    fontSize: "0.85rem",
    color: "#16a34a",
  },
  section: {
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
  },
  sectionMuted: {
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px dashed #e5e7eb",
    opacity: 0.8,
  },
  sectionTitle: {
    margin: 0,
    marginBottom: "0.5rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  sectionHelp: {
    margin: 0,
    marginBottom: "1rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  input: {
    borderRadius: "0.75rem",
    border: "1px solid #d1d5db",
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
  },
  textarea: {
    borderRadius: "0.75rem",
    border: "1px solid #d1d5db",
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
    resize: "vertical",
  },
  fieldHint: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  buttonPrimary: {
    padding: "0.5rem 1rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "0.5rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid #cbd5f5",
    backgroundColor: "#f8fafc",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};

export default AdminHome;
