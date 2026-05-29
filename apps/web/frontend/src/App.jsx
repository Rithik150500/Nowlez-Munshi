import React, { useEffect, useState } from "react";
import { api, getToken, setToken } from "./api.js";
import Login from "./Login.jsx";
import CaseBook from "./CaseBook.jsx";
import CaseDetail from "./CaseDetail.jsx";
import Notifications from "./Notifications.jsx";
import Chat from "./Chat.jsx";

export default function App() {
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("cases");
  const [openCnr, setOpenCnr] = useState(null);

  // Continuity handoff: a WhatsApp "open on web" link arrives as
  // /link#token=…&next=… — exchange the token for a session, then deep-navigate.
  const consumeLinkHash = async () => {
    if (!window.location.hash.startsWith("#token=")) return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");
    const next = params.get("next") || "/";
    history.replaceState(null, "", window.location.pathname); // strip token from URL
    try {
      const r = await api.exchangeLink(token);
      setToken(r.access_token);
      const m = next.match(/^\/cases\/([A-Za-z0-9]+)/);
      if (m) {
        setTab("cases");
        setOpenCnr(m[1].toUpperCase());
      } else if (next.startsWith("/chat")) {
        setTab("chat");
      }
    } catch {
      setToken(null);
    }
  };

  const loadMe = async () => {
    await consumeLinkHash();
    if (!getToken()) {
      setMe(null);
      setReady(true);
      return;
    }
    try {
      setMe(await api.me());
    } catch {
      setToken(null);
      setMe(null);
    } finally {
      setReady(true);
    }
  };
  useEffect(() => {
    loadMe();
  }, []);

  if (!ready) return <div className="app">Loading…</div>;
  if (!me) return <Login onLogin={loadMe} />;

  const logout = () => {
    setToken(null);
    setMe(null);
  };

  return (
    <div className="app">
      <div className="topbar">
        <span className="brand">🧑‍⚖️ Nowlez Munshi</span>
        <span className="row">
          <span className="muted">{me.name || me.phone}</span>
          <button className="ghost" onClick={logout}>
            Logout
          </button>
        </span>
      </div>
      <div className="tabs">
        <button
          className={`tab ${tab === "cases" ? "active" : ""}`}
          onClick={() => {
            setTab("cases");
            setOpenCnr(null);
          }}
        >
          Case book
        </button>
        <button className={`tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>
          Ask Munshi
        </button>
        <button className={`tab ${tab === "alerts" ? "active" : ""}`} onClick={() => setTab("alerts")}>
          Alerts
        </button>
      </div>
      {tab === "cases" &&
        (openCnr ? (
          <CaseDetail cnr={openCnr} onBack={() => setOpenCnr(null)} />
        ) : (
          <CaseBook onOpen={setOpenCnr} />
        ))}
      {tab === "chat" && <Chat />}
      {tab === "alerts" && <Notifications />}
    </div>
  );
}
