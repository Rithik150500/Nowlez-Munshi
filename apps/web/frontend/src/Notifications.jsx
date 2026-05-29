import React, { useEffect, useState } from "react";
import { api } from "./api.js";
import { enablePush } from "./push.js";

const PUSH_STATUS = {
  subscribed: "🔔 Push notifications on",
  denied: "Notifications blocked in your browser",
  disabled: "Push isn't configured on the server",
  unsupported: "This browser doesn't support push",
};

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [pushMsg, setPushMsg] = useState("");

  const load = async () => setItems((await api.notifications()).notifications);
  useEffect(() => {
    load();
  }, []);

  const read = async (id) => {
    await api.markRead(id);
    await load();
  };

  const subscribe = async () => {
    try {
      setPushMsg(PUSH_STATUS[await enablePush()] || "");
    } catch (e) {
      setPushMsg(e.message);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="row">
          <span className="grow">Get browser alerts when your cases change.</span>
          <button className="ghost" onClick={subscribe}>
            Enable push
          </button>
        </div>
        {pushMsg && <p className="muted">{pushMsg}</p>}
      </div>
      {items.length === 0 && <p className="muted">No notifications yet.</p>}
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
