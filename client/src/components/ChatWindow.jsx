// client/src/components/ChatWindow.jsx
import React from "react";

function ChatWindow({ messages, isTyping }) {
    return (
        <div className="rounded-[22px] p-2.5 bg-white border border-gray-200 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
            {messages && messages.length > 0 ? (
                messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex my-0.5 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        className={`
                            max-w-[78%] px-2.5 py-2 rounded-xl text-[13px] leading-relaxed
                            border shadow-[0_4px_10px_rgba(15,23,42,0.04)] whitespace-pre-wrap break-words
                            ${
                                msg.sender === "user"
                                    ? "bg-gradient-to-br from-nws-yellow/16 to-nws-teal/26 text-gray-900 rounded-tr-xxl rounded-br-md border-yellow-300/70"
                                    : "bg-gray-50 rounded-tl-xxl rounded-tr-xl rounded-bl-xl rounded-br-md border-gray-200"
                            }
                        `}
                    >
                        {msg.sender === "mentor" && (
                            <span className="block text-[10px] uppercase tracking-[0.14em] text-nws-purple mb-0.5">
                                Mentor
                            </span>
                        )}
                        <MessageContent text={msg.content} sender={msg.sender} />
                    </div>
                </div>
            ))
            ) : (
                <div className="text-center text-gray-400 py-8">
                    Aucun message pour le moment...
                </div>
            )}

            {isTyping && (
                <div className="flex justify-start my-0.5">
                    <div className="max-w-[78%] px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="inline-flex gap-[3px] items-center text-xs text-gray-500">
                            <span className="w-1 h-1 rounded-full bg-nws-purple opacity-40 typing-dot" />
                            <span className="w-1 h-1 rounded-full bg-nws-purple opacity-40 typing-dot" />
                            <span className="w-1 h-1 rounded-full bg-nws-purple opacity-40 typing-dot" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Composant pour gérer le contenu avec support basique Markdown
function MessageContent({ text, sender }) {
    // Vérification de sécurité
    if (!text) {
        return <span></span>;
    }

    if (sender !== "mentor") {
        return <span>{text}</span>;
    }

    // Support basique pour les liens et le code inline
    const parts = text.split(/(`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g);

    return (
        <span>
            {parts.map((part, i) => {
                // Ignorer les parties undefined ou vides
                if (!part) {
                    return null;
                }

                // Code inline
                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code
                            key={i}
                            className="font-mono text-[9px] px-1 py-0.5 rounded bg-gray-900 border border-indigo-300/50 text-nws-yellow"
                        >
                            {part.slice(1, -1)}
                        </code>
                    );
                }

                // Lien Markdown [texte](url)
                const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (linkMatch) {
                    return (
                        <a
                            key={i}
                            href={linkMatch[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-nws-purple no-underline border-b border-nws-purple/30 hover:border-nws-purple/80 transition-colors"
                        >
                            {linkMatch[1]}
                        </a>
                    );
                }

                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}

export default ChatWindow;