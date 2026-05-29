import React, { useEffect, useState } from "react";
import { api } from "./api.js";

export default function Calendar({ onOpen }) {
  const [hearings, setHearings] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.calendar().then((d) => setHearings(d.hearings));
    api.analytics().then(setStats);
  }, []);

  // group by date
  const byDate = {};
  for (const h of hearings) (byDate[h.next_hearing_date] ||= []).push(h);

  return (
    <div>
      {stats && (
        <div className="card">
          <h3>Portfolio</h3>
          <div className="row" style={{ gap: 16, flexWrap: "wrap" }}>
            <span>📁 {stats.total} cases</span>
            <span>📅 {stats.upcoming_7} this week</span>
            <span>🗓️ {stats.upcoming_30} this month</span>
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            {Object.entries(stats.by_stage).map(([k, v]) => `${k}: ${v}`).join(" · ")}
          </div>
        </div>
      )}
      <div className="card">
        <h3>Upcoming hearings (30 days)</h3>
        {Object.keys(byDate).length === 0 && <p className="muted">Nothing scheduled.</p>}
        {Object.entries(byDate).map(([d, items]) => (
          <div key={d} style={{ marginBottom: 10 }}>
            <div className="badge">{d}</div>
            {items.map((c) => (
              <div
                key={c.cnr}
                className="row"
                style={{ cursor: "pointer", padding: "4px 0" }}
                onClick={() => onOpen && onOpen(c.cnr)}
              >
                <span className="grow">{c.title || c.cnr}</span>
                <span className="muted">{c.court}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
