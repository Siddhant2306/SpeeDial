import React, { useEffect, useRef, useState } from "react";
import { sendAiAgentMessage } from "../../../api/aiAgent";
import "../../../css/AiChatUI.css";
import {ModelViewer} from "../../../components/SpeediViwer"

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const WELCOME_MESSAGE = "Hi! How can I help?";

function toPositiveInt(value, fallback = 1) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

function normalizeCartItems(rawData) {
  let cart = rawData;

  if (Array.isArray(cart)) {
    const withCart = cart.find((x) => x && typeof x === "object" && "cart" in x);
    if (withCart && withCart.cart != null) cart = withCart.cart;
  } else if (cart && typeof cart === "object" && "cart" in cart) {
    cart = cart.cart;
  }

  if (Array.isArray(cart) && cart.length === 1 && Array.isArray(cart[0])) {
    cart = cart[0];
  }

  if (!Array.isArray(cart)) return [];

  return cart
    .map((it) => {
      if (it == null) return null;
      if (typeof it === "string") {
        const name = it.trim();
        return name ? { item: name, quantity: 1 } : null;
      }
      if (typeof it !== "object") return null;

      const name = String(it.item || it.name || it.product || it.title || "").trim();
      const quantity = toPositiveInt(it.quantity ?? it.qty ?? it.count ?? 1, 1);
      const normalizedItem = name || String(it.item || it.name || "").trim();
      if (!normalizedItem) return null;

      return {
        ...it,
        item: normalizedItem,
        quantity,
      };
    })
    .filter(Boolean);
}

const AIModal = ({ open, onClose, onAddToCart }) => {
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
      setSending(true);

      const userMessage = { id: makeId(), role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const res = await sendAiAgentMessage(text);
        const type = (res.type || "").trim().toLowerCase();
        let fallbackText =
          (res.message ||
            (typeof res.data === "string" ? res.data : "") ||
            "").trim();

        if (!fallbackText && res.data && typeof res.data === "object") {
          try {
            fallbackText = JSON.stringify(res.data);
          } catch (err) {
            // ignore
          }
        }

        if (fallbackText.length > 2000) {
          fallbackText = `${fallbackText.slice(0, 2000)}…`;
        }

        // =========================
        // 💬 MESSAGE (Standard Chat)
        // =========================
        if (type === "message") {
          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              role: "assistant",
              content: fallbackText || "…",
            },
          ]);
          return;
        }

        // =========================
        // 🖼️ PRODUCTS
        // =========================
        if (type === "products") {
          const items = Array.isArray(res.data)
            ? res.data
            : res.data && typeof res.data === "object"
              ? res.data.items || res.data.products || []
              : [];

          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              role: "assistant",
              content: res.message || fallbackText || "Here are some items:",
            },
            {
              id: makeId(),
              role: "assistant",
              type: "products", 
              items: Array.isArray(items) ? items : [],
            },
          ]);
          return;
        }

        // =========================
        // 🛒 CART
        // =========================
        if (type === "cart") {
          const cartItems = normalizeCartItems(res.data);

          // 1. Update Chat UI
          setMessages((prev) => [
            ...prev,
            { id: makeId(), role: "assistant", content: res.message || fallbackText || "Updated your cart." },
            { 
              id: makeId(), 
              role: "assistant", 
              type: "cart", 
              items: cartItems,
            },
          ]);

          // 2. 🔥 Update the Real Shop Cart
          if (onAddToCart) {
            cartItems.forEach((aiItem) => onAddToCart(aiItem));
          }

          return;
        }

        // =========================
        // 🧩 FALLBACK (Unknown type)
        // =========================
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: fallbackText || "Done.",
          },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: "Error: " + (e.message || "AI failed"),
          },
        ]);
      } finally {
        setSending(false);
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

        <div className="aiAssistantBody">
          <div className="aiModelPanel">
            <div className="aiModelFrame">
              <ModelViewer />
            </div>
          </div>

          <div className="aiChatPanel">
            {/* MESSAGES */}
            <div className="aiChatMessages">
              {messages.map((m) => (
                <div key={m.id} className={`aiChatMessageRow ${m.role}`}>
                  {m.role === "assistant" && <div className="aiMiniAvatar"></div>}

                  <div className={`aiChatMessage ${m.role}`}>
                    <div className="aiChatBubble">
                      {m.type?.toLowerCase() === "products" || m.type?.toLowerCase() === "cart" ? (
                        <div className="aiProductGrid">
                          {Array.isArray(m.items) && m.items.length > 0 ? (
                            m.items.map((item, i) => (
                              <div key={i} className="aiProductCard">
                                <img
                                  src={item.image || item.image_url || "https://via.placeholder.com/50"}
                                  className="aiProductImg"
                                  alt={item.name || "product"}
                                />
                                <div className="aiProductName">{item.name || item.item || "Unknown Product"}</div>

                                {item.price && <div className="aiProductPrice">{item.price}</div>}
                                {item.quantity && <div className="qty">Qty: {item.quantity}</div>}
                              </div>
                            ))
                          ) : (
                            <div className="aiChatText italic">No items found.</div>
                          )}
                        </div>
                      ) : (
                        <div className="aiChatText">{m.content || "no"}</div>
                      )}
                    </div>
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
      </div>
    </div>
  );
};

export default AIModal;
