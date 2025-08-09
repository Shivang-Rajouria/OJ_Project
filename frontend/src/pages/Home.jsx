import React, { useEffect, useState } from "react";
import { backendAxios } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    let mounted = true;
    backendAxios.get("/api/problems")
      .then(res => { if (mounted) setProblems(res.data); })
      .catch(err => { console.error(err); alert("Failed to load problems"); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => mounted = false;
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>All Problems</h2>
          <div style={{ color: "#6b7280" }}>Pick a problem and start coding</div>
        </div>
      </div>

      {loading ? <div className="card">Loadingâ€¦</div> : (
        <div className="grid">
          {problems.map(p => (
            <div key={p._id} className="problem-card card" onClick={() => nav(`/problems/${p._id}`)}>
              <h3 style={{ margin: 0 }}>{p.title}</h3>
              <p style={{ color: "#6b7280", marginTop: 8 }}>{(p.description || "").slice(0, 120)}{(p.description || "").length > 120 ? "..." : ""}</p>
              <div style={{ marginTop: 12, color: "#9ca3af", fontSize: 13 }}>{p.testCases?.length || 0} test(s)</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
