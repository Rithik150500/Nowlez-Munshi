// Tiny API client: token in localStorage, JSON fetch wrapper, auth + cases + notifications.
const TOKEN_KEY = "nm_access_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

async function req(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);
  return data;
}

export const api = {
  startLogin: (phone) => req("POST", "/api/auth/start", { phone }),
  verify: (otp_id, code, name) => req("POST", "/api/auth/verify", { otp_id, code, name }),
  devLogin: (phone, name) => req("POST", "/api/auth/dev-login", { phone, name }),
  me: () => req("GET", "/api/auth/me"),
  listCases: () => req("GET", "/api/cases"),
  addCase: (cnr) => req("POST", "/api/cases", { cnr }),
  getCase: (cnr) => req("GET", `/api/cases/${cnr}`),
  deleteCase: (cnr) => req("DELETE", `/api/cases/${cnr}`),
  refreshCase: (cnr) => req("POST", `/api/cases/${cnr}/refresh`),
  setPrefs: (cnr, prefs) => req("PUT", `/api/cases/${cnr}/prefs`, prefs),
  notifications: () => req("GET", "/api/notifications"),
  markRead: (id) => req("POST", `/api/notifications/${id}/read`),
  ask: (question, thread_id) => req("POST", "/api/ask", { question, thread_id }),
};
