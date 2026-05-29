import React, { useEffect, useState } from "react";
import { api } from "./api.js";

export default function Team() {
  const [accounts, setAccounts] = useState([]);
  const [sel, setSel] = useState(null);
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("viewer");
  const [err, setErr] = useState("");

  const loadAccounts = async () => setAccounts((await api.accounts()).accounts);
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadMembers = async (id) => {
    setSel(id);
    setErr("");
    try {
      setMembers((await api.members(id)).members);
    } catch (e) {
      setErr(e.message);
    }
  };

  const create = async () => {
    if (!newName.trim()) return;
    await api.createAccount(newName.trim());
    setNewName("");
    await loadAccounts();
  };

  const invite = async () => {
    setErr("");
    try {
      await api.invite(sel, phone.trim(), role);
      setPhone("");
      await loadMembers(sel);
    } catch (e) {
      setErr(e.message);
    }
  };

  const selAcc = accounts.find((a) => a.id === sel);
  return (
    <div>
      <div className="card">
        <h3>Your chambers</h3>
        {accounts.map((a) => (
          <div key={a.id} className="row" style={{ marginBottom: 4 }}>
            <span className="grow">
              {a.name}
              <span className="badge">{a.role}</span>
              {a.is_personal && <span className="badge">personal</span>}
            </span>
            <button className="ghost" onClick={() => loadMembers(a.id)}>
              Members
            </button>
          </div>
        ))}
        <div className="row" style={{ marginTop: 8 }}>
          <input
            className="grow"
            placeholder="New chamber name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={create}>Create</button>
        </div>
      </div>

      {sel && (
        <div className="card">
          <h3>{selAcc ? selAcc.name : "Members"}</h3>
          {members.map((m) => (
            <div key={m.user_id} className="muted">
              {m.name || m.phone} — {m.role}
            </div>
          ))}
          {selAcc && selAcc.role === "owner" && (
            <div className="row" style={{ marginTop: 8 }}>
              <input
                className="grow"
                placeholder="Invite by phone (+9199…)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="owner">owner</option>
              </select>
              <button onClick={invite}>Invite</button>
            </div>
          )}
          {err && <p className="err">{err}</p>}
        </div>
      )}
    </div>
  );
}
