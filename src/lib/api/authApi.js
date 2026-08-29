import httpClient from "./httpClient";

export async function login(email, password) {
  const { data } = await httpClient.post("/auth/login", { email, password });
  return data;
}

export function saveSession({ token, user }) {
  localStorage.setItem("elitetix_token", token);
  localStorage.setItem("elitetix_role", user.role);
  localStorage.setItem("elitetix_user", JSON.stringify(user));
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("elitetix_user") || "null");
  } catch {
    return null;
  }
}
