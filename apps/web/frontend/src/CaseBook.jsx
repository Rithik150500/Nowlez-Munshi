import React, { useEffect, useState } from "react";
import { api } from "./api.js";

export default function CaseBook({ onOpen }) {
  const [cases, setCases] = useState([]);
  const [cnr, setCnr] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setCases((await api.listCases()).cases);
    } catch (e) {
      setErr(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    setErr("");
    setBusy(true);
    try {
      await api.addCase(cnr.trim().toUpperCase());
      setCnr("");
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="row">
          <input
            className="grow"
            placeholder="Add a case by CNR (16 chars)"
            value={cnr}
            onChange={(e) => setCnr(e.target.value)}
          />
          <button onClick={add} disabled={busy || cnr.length < 16}>
            {busy ? "Adding…" : "Track"}
          </button>
        </div>
        {err && <p className="err">{err}</p>}
      </div>
      {cases.length === 0 && <p className="muted">No cases yet. Add one above.</p>}
      {cases.map((c) => (
        <div key={c.cnr} className="card" style={{ cursor: "pointer" }} onClick={() => onOpen(c.cnr)}>
          <h3>
            {c.title || c.cnr}
            <span className="badge">{c.added_via}</span>
          </h3>
          <div className="muted">{c.cnr} · {c.court || "—"}</div>
          <div>Stage: {c.stage || "—"} · Next hearing: {c.next_hearing_date || "—"}</div>
        </div>
      ))}
    </div>
  );
}
