import React, { useEffect, useRef, useState } from "react";
import { getAiAgentDebugConfig, sendAiAgentMessage } from "../../../api/aiAgent";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const AIModal = ({ open, onClose }) => {
  const [messages, setMessages] = useState(() => [
    { id: makeId(), role: "assistant", content: "Hi! How can I help?" },
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
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [open, messages.length, sending]);

  if (!open) return null;

  const config = getAiAgentDebugConfig();

  const handleClear = () => {
    if (sending) return;
    setError("");
    setDraft("");
    setMessages([{ id: makeId(), role: "assistant", content: "Hi! How can I help?" }]);
    inputRef.current?.focus();
  };

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
        <div className="modal-header relative">
          <div>
            <h3>AI Assistant</h3>
            <div className="aiChatMeta" title={`Request field: ${config.requestField}`}>
              {config.baseUrl}
              {config.chatPath}
            </div>
          </div>

          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="aiChatMessages" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`aiChatMessage ${m.role}`}>
              <div className="aiChatBubble">{m.content}</div>
            </div>
          ))}
          {sending && (
            <div className="aiChatMessage assistant">
              <div className="aiChatBubble">Typing…</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && <div className="aiChatError">{error}</div>}

        <div className="aiChatComposer">
          <textarea
            ref={inputRef}
            className="aiChatInput"
            placeholder="Type a message…"
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
            <button className="buy-btn secondary" onClick={handleClear} disabled={sending}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;