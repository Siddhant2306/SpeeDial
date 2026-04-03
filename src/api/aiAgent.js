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

function getMessageFromResponse(data) {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";

  // Common shapes
  const direct =
    data.reply ??
    data.response ??
    data.answer ??
    data.text ??
    data.message ??
    data.output ??
    data.result;
  if (typeof direct === "string") return direct;

  // OpenAI-compatible
  const choiceContent = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text;
  if (typeof choiceContent === "string") return choiceContent;

  return "";
}

function getErrorMessage(res, data, text) {
  const fromJson = data?.error || data?.message;
  if (typeof fromJson === "string" && fromJson.trim()) return fromJson.trim();
  if (typeof text === "string" && text.trim()) return text.trim();
  return `AI agent request failed (${res.status})`;
}

export async function sendAiAgentMessage(message) {
  const trimmed = String(message ?? "").trim();
  if (!trimmed) return "";

  const baseUrl = getAiAgentBaseUrl();
  const url = `${baseUrl}${getChatPath()}`;
  const body = { [getRequestField()]: trimmed };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  const data = (() => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  })();

  if (!res.ok) {
    throw new Error(getErrorMessage(res, data, text));
  }

  const msg = getMessageFromResponse(data);
  return (msg || text || "").trim();
}

export function getAiAgentDebugConfig() {
  return {
    baseUrl: getAiAgentBaseUrl(),
    chatPath: getChatPath(),
    requestField: getRequestField(),
  };
}

