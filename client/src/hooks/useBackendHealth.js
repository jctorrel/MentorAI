// src/hooks/useBackendHealth.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour surveiller l'état du backend
 * @returns {Object} État de connexion au backend
 */
export function useBackendHealth() {
    const [state, setState] = useState({
        online: false,
        statusLabel: "Vérification...",
    });

    useEffect(() => {
        let isMounted = true;

        async function checkBackendStatus() {
            try {
                const data = await apiFetch("/api/health", { method: "GET" });

                if (!isMounted) return;

                if (!data?.ok) {
                    setState({
                        online: false,
                        statusLabel: "Hors ligne (erreur serveur)",
                    });
                    return;
                }

                setState({
                    online: true,
                    statusLabel: "En ligne",
                });
            } catch (error) {
                if (!isMounted) return;
                
                setState({
                    online: false,
                    statusLabel: "Hors ligne (serveur injoignable)",
                });
            }
        }

        // Vérification initiale
        checkBackendStatus();

        // Écouter les événements online/offline du navigateur
        const handleOnline = () => checkBackendStatus();
        const handleOffline = () => {
            setState({
                online: false,
                statusLabel: "Hors ligne",
            });
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            isMounted = false;
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return state;
}
