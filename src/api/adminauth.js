import { apiRequest } from "./http";

export function loginAdmin({ email, username, password }) {
  return apiRequest("/admin/auth/login", {
    method: "POST",
    body: { email, username, password },
  });
}

export function adminValidate({ email, username, password }) {
  return apiRequest("/admin/auth/validate", {
    method: "GET",
    body: { email, username, password },
  });
}