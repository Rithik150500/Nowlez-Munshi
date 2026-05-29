import React, { useEffect, useState } from "react";
import { api } from "./api.js";

export default function Notifications() {
  const [items, setItems] = useState([]);

  const load = async () => setItems((await api.notifications()).notifications);
  useEffect(() => {
    load();
  }, []);

  const read = async (id) => {
    await api.markRead(id);
    await load();
  };

  if (items.length === 0) return <p className="muted">No notifications yet.</p>;
  return (
    <div>
      {items.map((n) => (
        <div key={n.id} className="card" style={{ opacity: n.read_at ? 0.6 : 1 }}>
          <div className="row">
            <h3 className="grow">
              {n.title}
              <span className="badge">{n.type}</span>
            </h3>
            {!n.read_at && (
              <button className="ghost" onClick={() => read(n.id)}>
                Mark read
              </button>
            )}
          </div>
          <p>{n.body}</p>
          <div className="muted">
            {n.cnr} · {n.channels_sent.join(", ")} · {n.created_at}
          </div>
        </div>
      ))}
    </div>
  );
}
