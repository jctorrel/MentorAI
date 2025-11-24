// client/src/MentorChatApp.jsx
import React, { useEffect, useState } from "react";
import "./styles.css";

import Header from "./components/Header.jsx";
import HelperBar from "./components/HelperBar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import InputBar from "./components/InputBar.jsx";

const DEFAULT_EMAIL = "etudiant.test@normandiewebschool.fr";
const PROGRAM_ID = "A1";

const INIT_MESSAGE =
  "Bonjour 👋\n" +
  "Je suis ton mentor pédagogique numérique. Voici les modules disponibles pour cette session, " +
  "sur quoi souhaites-tu travailler ?\n";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    sender: "mentor",
    content:
      "Bonjour 👋\n" +
      "Je suis ton mentor pédagogique numérique. " +
      "Sur quoi souhaites-tu travailler aujourd'hui ?\n"
  }
];

// Les noms de mois en français
const MONTHS = [
  "", // index 0 (inutile)
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre"
];

/**
 * Construit le message initial à partir de la liste de modules.
 * Fonction "pure" → facile à tester.
 */
export function buildInitMessage(modules) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return DEFAULT_MESSAGES[0].content;
  }

  const bulletList = modules
    .map((module) => {
      const label = module.label || "Module sans nom";
      const content = (module.content || []).join(", ");

      const monthName = MONTHS[module.end_month] || "une date inconnue";

      return `• **${label}** (_À faire avant fin ${monthName}_) \n ${content}`;
    })
    .join("\n\n");

  return `${INIT_MESSAGE}\n\n${bulletList}`;
}

function getStudentEmail() {
  const params = new URLSearchParams(window.location.search);
  return params.get("email") || DEFAULT_EMAIL;
}

function MentorChatApp() {
  const [studentEmail] = useState(getStudentEmail);
  const [messages, setMessages] = useState(() => DEFAULT_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);
  const [backendStatusLabel, setBackendStatusLabel] = useState("Hors ligne");
  const [inputValue, setInputValue] = useState("");

  // Health check
  useEffect(() => {
    let isMounted = true;

    async function checkBackendStatus() {
      try {
        const res = await fetch("/api/health", { method: "GET" });
        const data = await res.json().catch(() => ({}));

        if (!isMounted) return;

        if (!res.ok || !data) {
          setBackendOnline(false);
          setBackendStatusLabel("Hors ligne (erreur serveur)");
          return;
        }

        setBackendOnline(true);
        setBackendStatusLabel("En ligne");
      } catch (err) {
        if (!isMounted) return;
        setBackendOnline(false);
        setBackendStatusLabel("Hors ligne (serveur injoignable)");
      }
    }

    checkBackendStatus();

    const handleOnline = () => {
      checkBackendStatus();
    };

    const handleOffline = () => {
      setBackendOnline(false);
      setBackendStatusLabel("Hors ligne");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Initial conversation
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialConversation() {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ programID: PROGRAM_ID })
        };

        const res = await fetch("/api/init", requestOptions);
        if (!res.ok) {
          throw new Error("Réponse non OK de /api/init");
        }

        const data = await res.json();

        if (!data.modules || !Array.isArray(data.modules)) {
          console.warn("Format inattendu de /api/init");
          return;
        }

        if (!isMounted) return;

        const finalMessage = buildInitMessage(data.modules);

        setMessages([
          {
            id: 1,
            sender: "mentor",
            content: finalMessage
          }
        ]);
      } catch (err) {
        console.error("Erreur lors de l'appel à /api/init", err);
        // On garde DEFAULT_MESSAGES si ça plante
      }
    }

    fetchInitialConversation();

    return () => {
      isMounted = false;
    };
  }, []);

  function addUserMessage(text) {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        content: text
      }
    ]);
  }

  function addMentorMessageMarkdown(text) {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "mentor",
        content: text
      }
    ]);
  }

  async function sendMessageToBackend(message) {
    const payload = {
      email: studentEmail,
      message,
      programID: PROGRAM_ID
    };

    try {
      setIsLoading(true);
      setIsTyping(true);
      setError("");

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let mentorText =
        "Une erreur est survenue lors de la réponse du mentor. Réessaie plus tard.";

      try {
        const data = await resp.json();
        if (data && data.mentorReply) {
          mentorText = data.mentorReply;
        }
      } catch (e) {
        console.error("Erreur lors du parse JSON de la réponse du mentor", e);
      }

      addMentorMessageMarkdown(mentorText);
    } catch (e) {
      console.error("Erreur lors de l'appel à /api/chat", e);
      setError(
        "Impossible de contacter le mentor. Vérifie ta connexion ou réessaie plus tard."
      );
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;

    addUserMessage(text);
    setInputValue("");
    sendMessageToBackend(text);
  }

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
