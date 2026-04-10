import { apiRequest } from "./http";

export function AdminRegister({ email, username, password }) {
  return apiRequest("/admin/auth/register", {
    method: "POST",
    body: { email, username, password },
  });
}

export function adminValidate({ email, username, password }) {
  return apiRequest("/admin/auth/validate", {
    method: "POST",
    body: { email, username, password },
  });
}