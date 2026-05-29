import React, { useEffect, useState } from "react";
import { api } from "./api.js";

const LEVELS = ["all", "orders_only", "hearings_only", "digest_only"];

export default function CaseDetail({ cnr, onBack, onChanged }) {
  const [c, setC] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      setC(await api.getCase(cnr));
    } catch (e) {
      setErr(e.message);
    }
  };
  useEffect(() => {
    load();
  }, [cnr]);

  const refresh = async () => {
    setMsg("");
    setErr("");
    try {
      const r = await api.refreshCase(cnr);
      setMsg(r.changes.length ? r.changes.map((x) => x.summary).join("; ") : "No changes.");
      await load();
      onChanged && onChanged();
    } catch (e) {
      setErr(e.message);
    }
  };
  const setLevel = async (level) => {
    await api.setPrefs(cnr, { alert_level: level });
    setMsg(`Alerts set to ${level}.`);
  };

  if (!c) return <div className="card">{err || "Loading…"}</div>;
  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="ghost" onClick={onBack}>
          ← Back
        </button>
        <button onClick={refresh}>Refresh now</button>
        <select onChange={(e) => setLevel(e.target.value)} defaultValue="">
          <option value="" disabled>
            Alert level…
          </option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      {msg && <p className="muted">{msg}</p>}
      {err && <p className="err">{err}</p>}
      <div className="card">
        <h3>{c.title || c.cnr}</h3>
        <div className="muted">{c.cnr} · {c.portal}</div>
        <p>{c.court}</p>
        <p>Stage: {c.stage || "—"} · Next hearing: {c.next_hearing_date || "—"} · Judge: {c.judge || "—"}</p>
      </div>
      <div className="card">
        <div className="row">
          <h3 className="grow">Orders ({c.orders.length})</h3>
          {c.orders.length > 0 && (
            <button
              className="ghost"
              onClick={async () => {
                await api.processOrders(cnr);
                await load();
              }}
            >
              Summarize
            </button>
          )}
        </div>
        {c.orders.map((o) => (
          <div key={o.order_id} style={{ marginBottom: 8 }}>
            <div className="row">
              <span className="grow">
                {o.order_date} — {o.descriptive_name || `Order ${o.order_id}`}
              </span>
              {o.order_url && (
                <a href={o.order_url} target="_blank" rel="noreferrer">
                  PDF
                </a>
              )}
            </div>
            {o.summary && <div className="muted">{o.summary}</div>}
          </div>
        ))}
        {c.orders.length === 0 && <p className="muted">No orders yet.</p>}
      </div>
      <div className="card">
        <h3>Hearing history ({c.history.length})</h3>
        <ul className="history">
          {c.history.map((h, i) => (
            <li key={i}>
              {h.hearing_date} — {h.purpose} ({h.judge})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
