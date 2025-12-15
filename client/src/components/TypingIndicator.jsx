// ./src/components/TypingIndicator.jsx

import React from 'react';

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm w-fit">
            <div className="w-2 h-2 bg-nws-purple/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-nws-purple/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-nws-purple/40 rounded-full animate-bounce"></div>
        </div>
    );
}

export default TypingIndicator;