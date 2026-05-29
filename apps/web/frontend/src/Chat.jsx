import React, { useState } from "react";
import { api } from "./api.js";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const send = async () => {
    const question = q.trim();
    if (!question) return;
    setErr("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: question }]);
    setQ("");
    try {
      const a = await api.ask(question, threadId);
      setThreadId(a.thread_id);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: a.answer, citations: a.citations, mode: a.mode },
      ]);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Ask the Munshi</h3>
        <p className="muted">
          Ask about your cases — "what's listed this week?", "status of CNR…", "orders in…".
        </p>
      </div>
      {messages.map((m, i) => (
        <div key={i} className="card" style={{ background: m.role === "user" ? "#0b1220" : undefined }}>
          <div className="muted">{m.role === "user" ? "You" : "Munshi"}{m.mode ? ` · ${m.mode}` : ""}</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
          {m.citations && m.citations.length > 0 && (
            <div style={{ marginTop: 6 }}>
              {m.citations.map((c) => (
                <span key={c.cnr} className="badge">
                  📎 {c.cnr}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
      {err && <p className="err">{err}</p>}
      <div className="row" style={{ position: "sticky", bottom: 0, paddingTop: 8 }}>
        <input
          className="grow"
          placeholder="Ask a question…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} disabled={busy}>
          {busy ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
