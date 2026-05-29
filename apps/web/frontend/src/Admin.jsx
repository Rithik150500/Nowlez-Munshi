import React, { useEffect, useState } from "react";
import { api } from "./api.js";

export default function Admin() {
  const [o, setO] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api.adminOverview().then(setO).catch((e) => setErr(e.message));
  }, []);
  if (err) return <p className="err">{err}</p>;
  if (!o) return <p className="muted">Loading…</p>;
  return (
    <div className="card">
      <h3>Ops overview</h3>
      <div className="row" style={{ gap: 16, flexWrap: "wrap" }}>
        <span>👤 {o.users} users</span>
        <span>📁 {o.cases} cases</span>
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        Outbound:{" "}
        {Object.entries(o.outbound_by_status).map(([k, v]) => `${k}: ${v}`).join(" · ") || "none"}
      </div>
    </div>
  );
}
