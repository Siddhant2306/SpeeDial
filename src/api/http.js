const DEFAULT_API_BASE_URL = "http://localhost:8080";

function getBaseUrl() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;
  return baseUrl.replace(/\/$/, "");
}

export async function apiRequest(path, { method = "GET", headers, body } = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${getBaseUrl()}${normalizedPath}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

