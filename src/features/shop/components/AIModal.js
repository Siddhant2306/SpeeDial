import React, { useEffect, useRef, useState } from "react";
import { sendAiAgentMessage } from "../../../api/aiAgent";
import "../../../css/AiChatUI.css";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const WELCOME_MESSAGE = "Hi! How can I help?";

const AIModal = ({ open, onClose }) => {
  const [messages, setMessages] = useState(() => [
    { id: makeId(), role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages.length, sending]);

  if (!open) return null;

  const handleSend = async () => {
    const text = (draft || "").trim();
    if (!text || sending) return;

    setDraft("");
    setError("");
    setSending(true);

    const userMessage = { id: makeId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await sendAiAgentMessage(text);
      const assistantText = String(reply || "").trim() || "…";

      const assistantMessage = {
        id: makeId(),
        role: "assistant",
        content: assistantText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      const msg = e?.message || "Could not reach the AI agent.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", content: `Error: ${msg}` },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal aiChatModal" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="aiChatHeader">
          <div className="aiChatHeaderLeft">
            <div className="aiAvatar"></div>

            <div className="aiChatHeaderText">
              <h3 className="aiChatTitle">AI Assistant</h3>

              <div className="aiChatSubtext">
                <span className="aiStatusDot"></span>
                <span>Online</span>
              </div>
            </div>
          </div>

          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* MESSAGES */}
        <div className="aiChatMessages">
          {messages.map((m) => (
            <div key={m.id} className={`aiChatMessageRow ${m.role}`}>
              {m.role === "assistant" && <div className="aiMiniAvatar"></div>}

              <div className={`aiChatMessage ${m.role}`}>
                <div className="aiChatBubble">{m.content}</div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="aiChatMessageRow assistant">
              <div className="aiMiniAvatar"></div>

              <div className="aiChatMessage assistant">
                <div className="aiChatBubble aiTypingBubble">
                  <span className="aiTypingDot"></span>
                  <span className="aiTypingDot"></span>
                  <span className="aiTypingDot"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* ERROR */}
        {error && <div className="aiChatError">{error}</div>}

        {/* INPUT */}
        <div className="aiChatComposer">
          <textarea
            ref={inputRef}
            className="aiChatInput"
            placeholder="Type a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={sending}
          />

          <div className="aiChatActions">
            <button
              className="buy-btn"
              onClick={handleSend}
              disabled={sending || !(draft || "").trim()}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIModal;