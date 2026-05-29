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
  updateProfile: (body) => req("PUT", "/api/auth/me", body),
  i18n: (locale) => req("GET", `/api/i18n?locale=${encodeURIComponent(locale || "en")}`),
  listCases: () => req("GET", "/api/cases"),
  addCase: (cnr) => req("POST", "/api/cases", { cnr }),
  getCase: (cnr) => req("GET", `/api/cases/${cnr}`),
  deleteCase: (cnr) => req("DELETE", `/api/cases/${cnr}`),
  refreshCase: (cnr) => req("POST", `/api/cases/${cnr}/refresh`),
  processOrders: (cnr) => req("POST", `/api/cases/${cnr}/process-orders`),
  setPrefs: (cnr, prefs) => req("PUT", `/api/cases/${cnr}/prefs`, prefs),
  notifications: () => req("GET", "/api/notifications"),
  markRead: (id) => req("POST", `/api/notifications/${id}/read`),
  ask: (question, thread_id) => req("POST", "/api/ask", { question, thread_id }),
  exchangeLink: (token) => req("POST", "/api/auth/link", { token }),
  accounts: () => req("GET", "/api/accounts"),
  createAccount: (name) => req("POST", "/api/accounts", { name }),
  members: (id) => req("GET", `/api/accounts/${id}/members`),
  invite: (id, phone, role) => req("POST", `/api/accounts/${id}/members`, { phone, role }),
  calendar: () => req("GET", "/api/calendar"),
  analytics: () => req("GET", "/api/analytics"),
  adminOverview: () => req("GET", "/api/admin/overview"),
  searchStates: () => req("GET", "/api/search/states"),
  searchDistricts: (stateCode) =>
    req("GET", `/api/search/districts?state_code=${encodeURIComponent(stateCode)}`),
  searchCourtComplexes: (stateCode, districtCode) =>
    req(
      "GET",
      `/api/search/court-complexes?state_code=${encodeURIComponent(stateCode)}&district_code=${encodeURIComponent(districtCode)}`,
    ),
  searchParty: (q) => {
    const p = new URLSearchParams(q).toString();
    return req("GET", `/api/search/party?${p}`);
  },
  documents: () => req("GET", "/api/documents"),
  createDocument: (title) => req("POST", "/api/documents", { title }),
  editorConfig: (id) => req("GET", `/api/documents/${id}/editor`),
  uploadDocument: async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const headers = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch("/api/documents/upload", { method: "POST", headers, body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);
    return data;
  },
};
