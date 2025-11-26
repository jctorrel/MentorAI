// src/pages/AdminHome.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";

function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      setLoading(true);
      setError("");

      try {
        // simple "ping" : si on a accès à /api/admin/config -> on est admin
        const cfg = await apiFetch("/api/admin/config");
        if (cancelled) return;
        setConfig(cfg);
        setIsAdmin(true);
      } catch (e) {
        if (cancelled) return;

        // apiFetch renvoie Error("not_authorized") si 403 { error: "not_authorized" }
        const msg = e?.message || "Erreur d'accès à l'administration";
        setError(msg);

        if (msg === "not_authorized") {
          setIsAdmin(false);
        } else {
          // erreur inconnue : on peut afficher un message, mais on reste sur la page
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, []);

  // Pour afficher l'utilisateur courant (stocké au login)
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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Administration</h1>
            <p style={styles.subtitle}>
              Interface de gestion du mentor IA
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
            {config && (
              <div style={styles.configSummary}>
                <h2 style={styles.sectionTitle}>Configuration actuelle</h2>
                <p style={styles.configLine}>
                  <strong>Établissement :</strong> {config.school_name}
                </p>
                <p style={styles.configLine}>
                  <strong>Tonalité :</strong> {config.tone}
                </p>
              </div>
            )}

            <h2 style={styles.sectionTitle}>Sections disponibles</h2>
            <div style={styles.grid}>
              <Link to="/admin/config" style={styles.cardLink}>
                <div style={styles.sectionCard}>
                  <h3 style={styles.sectionCardTitle}>Config générale</h3>
                  <p style={styles.sectionCardText}>
                    Nom de l’école, tonalité, règles globales du mentor.
                  </p>
                </div>
              </Link>

              <Link to="/admin/prompts" style={styles.cardLink}>
                <div style={styles.sectionCard}>
                  <h3 style={styles.sectionCardTitle}>Prompts</h3>
                  <p style={styles.sectionCardText}>
                    Gérer les prompts utilisés par le mentor (à venir).
                  </p>
                </div>
              </Link>

              <Link to="/admin/programs" style={styles.cardLink}>
                <div style={styles.sectionCard}>
                  <h3 style={styles.sectionCardTitle}>Programmes</h3>
                  <p style={styles.sectionCardText}>
                    Gérer les programmes, modules et contenus (à venir).
                  </p>
                </div>
              </Link>
            </div>

            {error && error !== "not_authorized" && (
              <p style={styles.errorTextSmall}>
                Une erreur est survenue : {error}
              </p>
            )}

            <button
              style={styles.buttonSecondary}
              onClick={() => navigate("/")}
            >
              ← Retour à l’application
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "1120px",
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
    maxWidth: "1120px",
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
    marginTop: "0.75rem",
    fontSize: "0.8rem",
    color: "#ef4444",
  },
  configSummary: {
    marginBottom: "1.5rem",
    padding: "1rem 1.25rem",
    borderRadius: "1rem",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  configLine: {
    margin: "0.25rem 0",
    fontSize: "0.9rem",
    color: "#334155",
  },
  sectionTitle: {
    margin: 0,
    marginBottom: "0.75rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  cardLink: {
    textDecoration: "none",
  },
  sectionCard: {
    borderRadius: "1rem",
    padding: "1rem 1.25rem",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    transition: "transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s",
  },
  sectionCardTitle: {
    margin: 0,
    marginBottom: "0.25rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  sectionCardText: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#64748b",
  },
  buttonSecondary: {
    marginTop: "0.5rem",
    padding: "0.5rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid #cbd5f5",
    backgroundColor: "#f8fafc",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};

export default AdminHome;
