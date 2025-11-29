// client/src/MentorChatApp.jsx
import React, { useState, useCallback } from "react";

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
        clearModules();
        await handleUserMessage(text);
    };

    /**
     * Gère la soumission du formulaire
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const text = inputValue.trim();
        if (!text || isLoading) return;

        setInputValue("");
        clearModules();
        await handleUserMessage(text);
    };

    return (
        <div className="flex justify-center items-stretch min-h-screen p-4 md:p-[18px]">
            <div className="w-full max-w-[1120px] bg-white rounded-3xl p-4 md:p-[18px] shadow-soft border border-gray-100 flex flex-col gap-2.5">
                <Header
                    backendOnline={backendOnline}
                    backendStatusLabel={backendStatusLabel}
                />

                <div className="grid grid-rows-[auto_1fr_auto] gap-2 flex-1 min-h-0">
                    <HelperBar studentEmail={studentEmail} />

                    <ChatWindow messages={messages} isTyping={isTyping} />

                    <div>
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
                        {error && (
                            <div className="text-xs text-red-700 px-2 py-1 mt-1 bg-red-50 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentorChatApp;
