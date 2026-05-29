"use strict";

let token = sessionStorage.getItem("nm_token") || null;

const $ = (id) => document.getElementById(id);

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function devLogin() {
  const phone = $("phone").value.trim();
  const res = await fetch("/auth/dev-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    alert("Login failed: " + (await res.text()));
    return;
  }
  token = (await res.json()).access_token;
  sessionStorage.setItem("nm_token", token);
  showApp();
}

function logout() {
  token = null;
  sessionStorage.removeItem("nm_token");
  $("appCard").classList.add("hide");
  $("loginCard").classList.remove("hide");
}

async function loadCases() {
  const res = await fetch("/cases", { headers: authHeaders() });
  if (res.status === 401) return logout();
  const { cases } = await res.json();
  $("cases").innerHTML =
    cases.length === 0
      ? '<p class="muted">No cases yet. Run scripts/seed_demo.py.</p>'
      : cases
          .map(
            (c) => `
      <div class="case">
        <strong>${c.title}</strong>
        <span class="badge ${c.added_via}">added via ${c.added_via}</span>
        <div class="muted">CNR ${c.cnr} · ${c.case_status || "unknown"} · next hearing ${c.next_hearing_date}</div>
      </div>`
          )
          .join("");
}

async function ask() {
  const question = $("question").value.trim();
  if (!question) return;
  const res = await fetch("/munshi/ask", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ question }),
  });
  if (res.status === 401) return logout();
  const data = await res.json();
  $("answerWrap").classList.remove("hide");
  $("answer").textContent = data.answer;
  $("cites").textContent =
    (data.citations || []).length
      ? "Sources: " + data.citations.map((c) => c.cnr).join(", ") + `  ·  (${data.mode})`
      : `(${data.mode})`;
}

function showApp() {
  $("loginCard").classList.add("hide");
  $("appCard").classList.remove("hide");
  loadCases();
}

$("loginBtn").addEventListener("click", devLogin);
$("logoutBtn").addEventListener("click", logout);
$("askBtn").addEventListener("click", ask);
$("question").addEventListener("keydown", (e) => {
  if (e.key === "Enter") ask();
});

if (token) showApp();
