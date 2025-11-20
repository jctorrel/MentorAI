import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import TypingBubble from "./TypingBubble.jsx";

function ChatWindow({ messages, isTyping }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="chat" ref={chatRef}>
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingBubble />}
    </div>
  );
}

export default ChatWindow;
