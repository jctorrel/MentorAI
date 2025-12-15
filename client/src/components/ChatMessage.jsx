// client/src/components/ChatMessage.jsx
import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, Copy, Check } from "lucide-react";

function ChatMessage({ message }) {
    const isUser = message.sender === "user";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        // Changement ici : w-full + justify-start/end explicite
        <div className={`
            w-full flex gap-3 mb-6 
            ${isUser ? "flex-row-reverse justify-start" : "flex-row justify-start"}
        `}>
            
            {/* --- Avatar --- */}
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm
                ${isUser ? "bg-nws-purple text-white" : "bg-white border border-slate-200 text-nws-purple"}
            `}>
                {isUser ? <User size={16} /> : <Sparkles size={16} />}
            </div>

            {/* --- Bulle de message --- */}
            <div className={`
                relative max-w-[85%] sm:max-w-[75%] px-5 py-4 shadow-sm text-sm leading-relaxed group
                ${isUser 
                    ? "bg-nws-purple text-white rounded-2xl rounded-tr-none text-left" 
                    : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none"
                }
            `}>
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 opacity-70 ${isUser ? "text-purple-100" : "text-slate-400"}`}>
                    {isUser ? "Vous" : "Mentor AI"}
                </div>

                {/* --- Contenu --- */}
                {isUser ? (
                    <div className="whitespace-pre-wrap font-medium">{message.content}</div>
                ) : (
                    <div className="markdown-body">
                         {/* Styles CSS (identiques à avant) */}
                        <style>{`
                            .markdown-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.5rem; }
                            .markdown-body ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.5rem; }
                            .markdown-body li { margin-bottom: 0.25rem; }
                            .markdown-body p { margin-bottom: 0.75rem; }
                            .markdown-body strong { font-weight: 700; color: #1e293b; }
                            .markdown-body pre { background: #1e293b; color: #e2e8f0; padding: 0.75rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; }
                            .markdown-body code { font-family: monospace; font-size: 0.9em; }
                            .markdown-body :not(pre) > code { background: #f1f5f9; color: #475569; padding: 0.1rem 0.3rem; border-radius: 0.25rem; border: 1px solid #e2e8f0; }
                            .markdown-body blockquote { border-left: 3px solid #cbd5e1; padding-left: 1rem; color: #64748b; font-style: italic; }
                            .markdown-body a { color: #7c3aed; text-decoration: underline; text-underline-offset: 2px; }
                            .markdown-body h3 { font-weight: 700; color: #0f172a; margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.1em; }
                        `}</style>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    </div>
                )}

                {!isUser && (
                    <button 
                        onClick={handleCopy}
                        className="absolute -bottom-6 left-0 text-slate-400 hover:text-nws-purple opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 py-1"
                    >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "Copié !" : "Copier"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ChatMessage;