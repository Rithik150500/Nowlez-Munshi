import React, { useEffect, useState } from "react";
import { api } from "./api.js";

// District-court search: pick state → district → court complex, then search by party
// name + year. Each result can be tracked (POST /api/cases) into the case book.
export default function Search({ onTracked }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [stateCode, setStateCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [courtCode, setCourtCode] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [results, setResults] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .searchStates()
      .then((r) => setStates(r.states))
      .catch((e) => setErr(e.message));
  }, []);

  const onState = async (code) => {
    setStateCode(code);
    setDistrictCode("");
    setCourtCode("");
    setDistricts([]);
    setComplexes([]);
    if (code) setDistricts((await api.searchDistricts(code)).districts);
  };
  const onDistrict = async (code) => {
    setDistrictCode(code);
    setCourtCode("");
    setComplexes([]);
    if (code) setComplexes((await api.searchCourtComplexes(stateCode, code)).court_complexes);
  };

  const run = async () => {
    setErr("");
    setBusy(true);
    try {
      const r = await api.searchParty({
        state_code: stateCode,
        district_code: districtCode,
        court_code_arr: courtCode,
        name,
        year,
      });
      setResults(r.results);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const track = async (cnr) => {
    try {
      await api.addCase(cnr);
      if (onTracked) onTracked(cnr);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="row">
          <select value={stateCode} onChange={(e) => onState(e.target.value)}>
            <option value="">State…</option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
          <select value={districtCode} onChange={(e) => onDistrict(e.target.value)} disabled={!stateCode}>
            <option value="">District…</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
          <select value={courtCode} onChange={(e) => setCourtCode(e.target.value)} disabled={!districtCode}>
            <option value="">Court complex…</option>
            {complexes.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="row">
          <input
            className="grow"
            placeholder="Party name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            style={{ width: "6em" }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <button onClick={run} disabled={busy || !courtCode || !name}>
            {busy ? "Searching…" : "Search"}
          </button>
        </div>
        {err && <p className="err">{err}</p>}
      </div>
      {results.map((r) => (
        <div key={r.cnr} className="card">
          <h3>{r.title}</h3>
          <div className="muted">{r.cnr} · {r.case_number} · {r.court}</div>
          <div className="row">
            <span>Stage: {r.stage || "—"}</span>
            <button className="ghost" onClick={() => track(r.cnr)}>Track</button>
          </div>
        </div>
      ))}
    </div>
  );
}
