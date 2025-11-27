// client/src/MentorChatApp.jsx
import React, { useState, useCallback } from "react";
import "../styles.css";

import Header from "../components/Header.jsx";
import HelperBar from "../components/HelperBar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import InputBar from "../components/InputBar.jsx";
import QuickActions from "../components/QuickActions.jsx";

import { useBackendHealth } from "../hooks/useBackendHealth";
import { useChatSession } from "../hooks/useChatSession";
import { useModules } from "../hooks/useModules";
import { getCurrentUserEmail } from "../utils/storage";

function MentorChatApp() {
    const [studentEmail] = useState(getCurrentUserEmail);
    const [inputValue, setInputValue] = useState("");

    // Hook pour surveiller l'état du backend
    const { online: backendOnline, statusLabel: backendStatusLabel } = useBackendHealth();

    // Hook pour gérer la session de chat
    const {
        messages,
        isTyping,
        isLoading,
        error,
        handleUserMessage,
        setInitialMessages,
    } = useChatSession(studentEmail);

    // Hook pour gérer les modules avec callback d'initialisation
    const handleModulesInitialized = useCallback(
        (initialMessages) => {
            setInitialMessages(initialMessages);
        },
        [setInitialMessages]
    );

    const { modules, clearModules } = useModules(handleModulesInitialized);

    /**
     * Gère le clic sur un module dans les QuickActions
     */
    const handleModuleClick = async (module) => {
        const text = `Je veux travailler sur le module "${module.label}"`;
        clearModules(); // Masquer les actions rapides après sélection
        await handleUserMessage(text);
    };

    /**
     * Gère la soumission du formulaire
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const text = inputValue.trim();
        if (!text || isLoading) return;

        setInputValue(""); // Vider le champ immédiatement
        clearModules(); // Masquer les actions rapides après sélection
        await handleUserMessage(text);
    };

    return (
        <div className="app">
            <Header
                backendOnline={backendOnline}
                backendStatusLabel={backendStatusLabel}
            />

            <div className="chat-wrapper">
                <HelperBar studentEmail={studentEmail} />

                <ChatWindow messages={messages} isTyping={isTyping} />

                <div className="input-zone">
                    <QuickActions
                        modules={modules}
                        onModuleClick={handleModuleClick}
                    />
                    <InputBar
                        value={inputValue}
                        onChange={setInputValue}
                        onSubmit={handleSubmit}
                        disabled={isLoading}
                    />
                    {error && <div className="error-banner">{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default MentorChatApp;
