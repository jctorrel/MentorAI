// client/src/components/ChatWindow.jsx

import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { MessageSquareDashed } from "lucide-react";

function ChatWindow({ messages, isTyping }) {
    const bottomRef = useRef(null);

    // Auto-scroll vers le bas
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        // Changement ici : Suppression de 'max-w-3xl mx-auto' pour utiliser toute la largeur
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth custom-scrollbar">
            
            {/* État vide */}
            {(!messages || messages.length === 0) && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <MessageSquareDashed size={48} strokeWidth={1.5} />
                    <p className="mt-4 text-sm font-medium">La conversation démarre ici...</p>
                </div>
            )}

            {/* Liste des messages */}
            <div className="flex flex-col w-full">
                {messages && messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}

                {/* Indicateur de frappe */}
                {isTyping && (
                    <div className="flex gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {/* Avatar Mentor pour l'indicateur */}
                         <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm text-nws-purple">
                            <Sparkles size={16} />
                        </div>
                        <TypingIndicator />
                    </div>
                )}
                
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

export default ChatWindow;