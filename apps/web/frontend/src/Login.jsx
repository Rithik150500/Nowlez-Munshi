import React, { useState } from "react";
import { api, setToken } from "./api.js";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otpId, setOtpId] = useState(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const wrap = (fn) => async () => {
    setErr("");
    try {
      await fn();
    } catch (e) {
      setErr(e.message);
    }
  };

  const start = wrap(async () => {
    const r = await api.startLogin(phone);
    setOtpId(r.otp_id);
  });
  const verify = wrap(async () => {
    const r = await api.verify(otpId, code, name);
    setToken(r.access_token);
    onLogin();
  });
  const dev = wrap(async () => {
    const r = await api.devLogin(phone || "+919000000000", name || "Demo Advocate");
    setToken(r.access_token);
    onLogin();
  });

  return (
    <div className="app">
      <div className="brand">🧑‍⚖️ Nowlez Munshi</div>
      <p className="muted">Your chamber's AI munshi — every case, every hearing, every order.</p>
      <div className="card">
        <h3>Sign in</h3>
        <div className="row" style={{ marginBottom: 8 }}>
          <input
            className="grow"
            placeholder="Phone (E.164, e.g. +9199…)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="row" style={{ marginBottom: 8 }}>
          <input
            className="grow"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {!otpId ? (
          <button onClick={start}>Send OTP</button>
        ) : (
          <div className="row">
            <input placeholder="OTP code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button onClick={verify}>Verify</button>
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <button className="ghost" onClick={dev}>
            Dev login (demo)
          </button>
        </div>
        {err && <p className="err">{err}</p>}
      </div>
    </div>
  );
}
