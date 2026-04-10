function getAiAgentBaseUrl() {
  const raw = (process.env.REACT_APP_AI_AGENT_BASE_URL || "http://127.0.0.1:5000").trim();
  return raw.replace(/\/$/, "");
}

function getChatPath() {
  const raw = (process.env.REACT_APP_AI_AGENT_CHAT_PATH || "/chat").trim();
  if (!raw) return "/chat";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function getRequestField() {
  const raw = (process.env.REACT_APP_AI_AGENT_REQ_FIELD || "message").trim();
  return raw || "message";
}

function getErrorMessage(res, data, text) {
  const fromJson = data?.error || data?.message;
  if (typeof fromJson === "string" && fromJson.trim()) return fromJson.trim();
  if (typeof text === "string" && text.trim()) return text.trim();
  return `AI agent request failed (${res.status})`;
}

export async function sendAiAgentMessage(message) {
  const trimmed = String(message ?? "").trim();
  if (!trimmed) return null;

  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("User not logged in");

  const url = `${getAiAgentBaseUrl()}${getChatPath()}`;
  const body = {                                 // request payload structure is { [requestField]: message, user_id: ... }
    [getRequestField()]: trimmed,
    user_id: userId,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // Use your existing helper to extract the best error string
      const errorText = getErrorMessage(res, data, "Network response was not ok");
      throw new Error(errorText);
    }

    // Return a lightly-normalized object for the UI components.
    // Supports both:
    // - { type, message, data }
    // - { reply: { type, message, data } }  (speedi_ai_bot backend json structure)
    let payload = data;
    if (payload && typeof payload === "object" && "reply" in payload) {
      payload = payload.reply;
    }

    if (typeof payload === "string") {
      const text = payload.trim();
      return { type: "message", message: text, data: text };
    }

    const rawType = payload?.type ?? data?.type ?? "message";
    const type = String(rawType || "message").trim() || "message";

    let messageText = payload?.message;
    const responseData =
      payload?.data ??
      payload?.reply ??
      payload?.response ??
      payload?.answer ??
      payload?.text;

    if (typeof messageText !== "string") {
      messageText = "";
    }

    if (!messageText.trim() && typeof responseData === "string") {
      messageText = responseData;
    }

    return {
      type,
      message: messageText,
      data: responseData,
    };
  } catch (err) {
    console.error("AI Agent Error:", err);
    throw err;
  }
}
export function getAiAgentDebugConfig() {
  return {
    baseUrl: getAiAgentBaseUrl(),
    chatPath: getChatPath(),
    requestField: getRequestField(),
  };
}

