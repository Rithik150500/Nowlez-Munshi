import React, { useEffect, useRef, useState } from "react";
import { api } from "./api.js";

// Loads the OnlyOffice DocsAPI script from the Document Server, once.
function loadDocsApi(serverUrl) {
  return new Promise((resolve, reject) => {
    if (window.DocsAPI) return resolve();
    if (!serverUrl) return reject(new Error("Document editing isn't configured."));
    const s = document.createElement("script");
    s.src = `${serverUrl.replace(/\/$/, "")}/web-apps/apps/api/documents/api.js`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load the document editor."));
    document.body.appendChild(s);
  });
}

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");
  const holder = useRef(null);

  const load = async () => setDocs((await api.documents()).documents);
  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!title.trim()) return;
    await api.createDocument(title.trim());
    setTitle("");
    await load();
  };

  const open = async (id) => {
    setErr("");
    setEditing(id);
    try {
      const { server_url, config } = await api.editorConfig(id);
      await loadDocsApi(server_url);
      // eslint-disable-next-line no-new, no-undef
      new window.DocsAPI.DocEditor("oo-holder", { ...config, width: "100%", height: "600px" });
    } catch (e) {
      setErr(e.message);
    }
  };

  if (editing) {
    return (
      <div>
        <button className="ghost" onClick={() => setEditing(null)}>
          ← Back to documents
        </button>
        {err && <p className="err">{err}</p>}
        <div id="oo-holder" ref={holder} style={{ marginTop: 12 }} />
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="row">
          <input
            className="grow"
            placeholder="New document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={create}>New DOCX</button>
        </div>
      </div>
      {docs.length === 0 && <p className="muted">No documents yet.</p>}
      {docs.map((d) => (
        <div key={d.id} className="card row" style={{ cursor: "pointer" }} onClick={() => open(d.id)}>
          <span className="grow">📄 {d.title}</span>
          <span className="muted">{d.filename}</span>
        </div>
      ))}
    </div>
  );
}
