// client/src/MentorChatApp.jsx
import React, { useState, useCallback } from "react";

// Composants UI
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import HelperBar from "../components/HelperBar";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";
import QuickActions from "../components/QuickActions";

// Hooks & Utils
import { useBackendHealth } from "../hooks/useBackendHealth";
import { useChatSession } from "../hooks/useChatSession";
import { useModules } from "../hooks/useModules";
import { useAdminSettings } from "../hooks/useAdminSettings";
import { getCurrentUserEmail } from "../utils/storage";
import { apiFetch } from "../utils/api";

function MentorChatApp() {
    const [studentEmail] = useState(getCurrentUserEmail);
    const [inputValue, setInputValue] = useState("");
    const [activeMode, setActiveMode] = useState("guided"); // "guided" ou "free"
    const [shouldShowModules, setShouldShowModules] = useState(true);

    // --- Hooks ---
    const { settings } = useAdminSettings();
    const { online, count, limit, incrementCount } = useBackendHealth(studentEmail);
    
    const {
        messages,
        isTyping,
        isLoading,
        error,
        handleUserMessage,
        setInitialMessages,
    } = useChatSession(studentEmail, [], incrementCount);

    const handleModulesInitialized = useCallback(
        (initialMessages) => {
            setInitialMessages(initialMessages);
        },
        [setInitialMessages]
    );

    const { modules } = useModules(handleModulesInitialized);

    // --- Gestionnaires d'événements ---

    const handleModeChange = (newMode) => {
        setActiveMode(newMode);
        // En mode libre, on cache les modules. En guidé, on les affiche.
        setShouldShowModules(newMode !== "free");
    };

    const handleModuleClick = async (module) => {
        setShouldShowModules(false);
        // On récupère le contexte du module
        try {
            const data = await apiFetch("/api/program", {
                method: "POST",
                body: JSON.stringify({ programID: "A1", moduleID: module.id, email: studentEmail }),
            });
            // On simule un message utilisateur pour lancer la conversation
            handleUserMessage(`Bonjour, J'aimerais travailler sur le module : ${module.label} (${data.module})`, activeMode);
        } catch (err) {
            console.error("Erreur chargement module", err);
        }
    };

    const handleSubmit = async (event) => {
        if(event) event.preventDefault();
        const text = inputValue.trim();
        if (!text || isLoading) return;

        setInputValue("");
        if (activeMode === "guided") {
            setShouldShowModules(false);
        }
        await handleUserMessage(text, activeMode);
    };

    // --- Rendu ---

    return (
        <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center sm:py-4 md:py-6 overflow-hidden">
            
            {/* Conteneur Principal (Card Layout sur Desktop, Fullscreen sur Mobile) */}
            <main className="w-full h-full max-w-[1500px] bg-white sm:rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden border border-slate-200/60 relative">
                
                {/* 1. HEADER (Fixe en haut) */}
                <Header online={online} count={count} limit={limit} />

                {/* 2. BARRE D'ONGLETS (Optionnelle) */}
                {settings.freeModeEnabled && (
                    <div className="px-4 pt-4 pb-0 bg-white z-10">
                        <TabBar activeMode={activeMode} onModeChange={handleModeChange} />
                    </div>
                )}

                {/* 3. BARRE D'INFO CONTEXTUELLE */}
                <HelperBar
                    studentEmail={studentEmail}
                    mode={settings.freeModeEnabled ? activeMode : "guided"}
                />

                {/* 4. ZONE DE CONTENU (Scrollable) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-white scroll-smooth">
                    
                    {/* Cas A : Affichage des Modules (QuickActions) */}
                    {shouldShowModules && (!settings.freeModeEnabled || activeMode === "guided") ? (
                        <div className="h-full flex flex-col justify-center">
                            <QuickActions
                                modules={modules}
                                onModuleClick={handleModuleClick}
                            />
                        </div>
                    ) : (
                        /* Cas B : Fenêtre de Chat */
                        <ChatWindow 
                            messages={messages} 
                            isTyping={isTyping} 
                        />
                    )}

                </div>

                {/* 5. ZONE DE SAISIE (Fixe en bas) */}
                {/* On cache l'input bar si on affiche les modules, car QuickActions gère l'interaction */}
                <div className="relative z-20">
                     {/* Affichage des erreurs globales si besoin */}
                     {error && (
                        <div className="absolute bottom-full left-0 right-0 mx-4 mb-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 shadow-sm flex justify-center animate-in slide-in-from-bottom-2">
                            {error}
                        </div>
                    )}
                    
                    <InputBar
                        value={inputValue}
                        onChange={setInputValue}
                        onSubmit={handleSubmit}
                        disabled={isLoading}
                        shouldShowModules={shouldShowModules && activeMode === "guided"}
                        placeholder={
                            settings.freeModeEnabled && activeMode === "free"
                                ? "Posez n'importe quelle question au mentor..."
                                : "Posez une question sur le module..."
                        }
                    />
                </div>

            </main>
        </div>
    );
}

export default MentorChatApp;