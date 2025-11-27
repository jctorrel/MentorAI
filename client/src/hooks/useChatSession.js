// src/hooks/useChatSession.js
import { useState, useCallback } from "react";
import { apiFetch } from "../utils/api";
import { createMessage, getDefaultErrorMessage } from "../utils/messageFormatter";

const PROGRAM_ID = "A1";

/**
 * Hook personnalisé pour gérer la session de chat
 * @param {string} studentEmail - Email de l'étudiant
 * @param {Array} initialMessages - Messages initiaux
 * @returns {Object} État et fonctions pour gérer le chat
 */
export function useChatSession(studentEmail, initialMessages = []) {
    const [messages, setMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    /**
     * Ajoute un message utilisateur au chat
     */
    const addUserMessage = useCallback((text) => {
        setMessages((prev) => [
            ...prev,
            createMessage(prev.length + 1, "user", text),
        ]);
    }, []);

    /**
     * Ajoute un message mentor au chat
     */
    const addMentorMessage = useCallback((text) => {
        setMessages((prev) => [
            ...prev,
            createMessage(prev.length + 1, "mentor", text),
        ]);
    }, []);

    /**
     * Remplace tous les messages (pour l'initialisation)
     */
    const setInitialMessages = useCallback((newMessages) => {
        setMessages(newMessages);
    }, []);

    /**
     * Envoie un message au backend et récupère la réponse du mentor
     */
    const sendMessage = useCallback(
        async (message) => {
            const payload = {
                email: studentEmail,
                message,
                programID: PROGRAM_ID,
            };

            try {
                setIsLoading(true);
                setIsTyping(true);
                setError("");

                const data = await apiFetch("/api/chat", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                const mentorText = data?.mentorReply || getDefaultErrorMessage();
                addMentorMessage(mentorText);
            } catch (err) {
                console.error("Erreur lors de l'appel à /api/chat", err);
                setError(
                    "Impossible de contacter le mentor. Vérifie ta connexion ou réessaie plus tard."
                );
                // Ajouter un message d'erreur dans le chat
                addMentorMessage(getDefaultErrorMessage());
            } finally {
                setIsLoading(false);
                setIsTyping(false);
            }
        },
        [studentEmail, addMentorMessage]
    );

    /**
     * Gère la soumission d'un message utilisateur
     */
    const handleUserMessage = useCallback(
        async (text) => {
            const trimmedText = text.trim();
            if (!trimmedText || isLoading) return;

            addUserMessage(trimmedText);
            await sendMessage(trimmedText);
        },
        [isLoading, addUserMessage, sendMessage]
    );

    return {
        messages,
        isTyping,
        isLoading,
        error,
        addUserMessage,
        addMentorMessage,
        setInitialMessages,
        sendMessage,
        handleUserMessage,
    };
}
