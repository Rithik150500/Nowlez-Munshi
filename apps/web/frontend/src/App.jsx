import React, { useEffect, useState } from "react";
import { api, getToken, setToken } from "./api.js";
import { loadCatalog, t } from "./i18n.js";
import Login from "./Login.jsx";
import CaseBook from "./CaseBook.jsx";
import CaseDetail from "./CaseDetail.jsx";
import Notifications from "./Notifications.jsx";
import Chat from "./Chat.jsx";
import Team from "./Team.jsx";
import Calendar from "./Calendar.jsx";
import Admin from "./Admin.jsx";
import Documents from "./Documents.jsx";
import Search from "./Search.jsx";

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
      const m = await api.me();
      await loadCatalog(m.locale);
      setMe(m);
    } catch {
      setToken(null);
      setMe(null);
    } finally {
      setReady(true);
    }
  };

  const switchLocale = async (loc) => {
    if (!me || loc === me.locale) return;
    const m = await api.updateProfile({ locale: loc });
    await loadCatalog(m.locale);
    setMe(m);
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
          <select
            className="ghost"
            value={me.locale || "en"}
            onChange={(e) => switchLocale(e.target.value)}
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="hi">हिं</option>
          </select>
          <button className="ghost" onClick={logout}>
            {t("logout")}
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
          {t("cases")}
        </button>
        <button className={`tab ${tab === "search" ? "active" : ""}`} onClick={() => setTab("search")}>
          {t("search")}
        </button>
        <button className={`tab ${tab === "calendar" ? "active" : ""}`} onClick={() => setTab("calendar")}>
          {t("calendar")}
        </button>
        <button className={`tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>
          {t("ask")}
        </button>
        <button className={`tab ${tab === "docs" ? "active" : ""}`} onClick={() => setTab("docs")}>
          {t("documents")}
        </button>
        <button className={`tab ${tab === "alerts" ? "active" : ""}`} onClick={() => setTab("alerts")}>
          {t("alerts")}
        </button>
        <button className={`tab ${tab === "team" ? "active" : ""}`} onClick={() => setTab("team")}>
          {t("chamber")}
        </button>
        {me.is_admin && (
          <button className={`tab ${tab === "admin" ? "active" : ""}`} onClick={() => setTab("admin")}>
            Admin
          </button>
        )}
      </div>
      {tab === "cases" &&
        (openCnr ? (
          <CaseDetail cnr={openCnr} onBack={() => setOpenCnr(null)} />
        ) : (
          <CaseBook onOpen={setOpenCnr} />
        ))}
      {tab === "calendar" && (
        <Calendar
          onOpen={(cnr) => {
            setTab("cases");
            setOpenCnr(cnr);
          }}
        />
      )}
      {tab === "search" && (
        <Search
          onTracked={(cnr) => {
            setTab("cases");
            setOpenCnr(cnr);
          }}
        />
      )}
      {tab === "chat" && <Chat />}
      {tab === "docs" && <Documents />}
      {tab === "alerts" && <Notifications />}
      {tab === "team" && <Team />}
      {tab === "admin" && me.is_admin && <Admin />}
    </div>
  );
}
