import React, { useEffect, useState } from "react";
import { backendAxios, COMPILER } from "../api/axios";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!id) return;
    backendAxios.get(`/api/problems/${id}`)
      .then(res => {
        setProblem(res.data);
        setCode(getStarterCode(language));
      })
      .catch(err => { console.error(err); alert("Failed to load problem"); });
  }, [id]);

  useEffect(() => {
    if (!problem) return;
    if (!code || code.trim() === "" || code.startsWith("# Read") || code.startsWith("//")) {
      setCode(getStarterCode(language));
    }
  }, [language]);

  function getStarterCode(lang) {
    if (lang === "python") return "# Read input and print result\n# Example:\n# a, b = map(int, input().split())\n# print(a + b)\n";
    return `#include <iostream>\nusing namespace std;\nint main(){\n    // read input and write output\n    return 0;\n}\n`;
  }

  // Submit to backend which coordinates with compiler microservice
  const run = async () => {
    if (!problem) return;
    setRunning(true);
    setResults(null);
    try {
      // We call backend /api/run which should send to compiler
      const payload = { problemId: problem._id, code, language };
      const res = await backendAxios.post("/api/run", payload, { timeout: 120000 });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults({ error: err.response?.data || err.message });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="editor-layout">
      <div className="left card">
        {!problem ? <div>Loading...</div> : (
          <>
            <h2 style={{ marginBottom: 6 }}>{problem.title}</h2>
            <div style={{ color: "#6b7280", marginBottom: 12 }}>Tests: {problem.testCases?.length || 0}</div>
            <div dangerouslySetInnerHTML={{ __html: problem.description || "" }} />
          </>
        )}
      </div>

      <div className="right">
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <label style={{ color: "#6b7280" }}>Language</label>
          <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <div style={{ marginLeft: "auto" }}>
            <button className="btn" onClick={() => setCode(getStarterCode(language))}>Reset</button>
            <button className="btn-primary" onClick={run} disabled={running} style={{ marginLeft: 8 }}>{running ? "Running..." : "Submit"}</button>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <Editor
            height="420px"
            defaultLanguage={language === "python" ? "python" : "cpp"}
            value={code}
            onChange={(v) => setCode(v)}
            options={{ fontSize: 13, minimap: { enabled: false } }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          {!results ? <div style={{ color: "#6b7280" }}>Run to see results</div> : (
            results.error ? <pre style={{ color: "red" }}>{JSON.stringify(results.error, null, 2)}</pre> : (
              <>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>Passed: {results.passed} / {results.total}</div>
                <div>
                  {results.details.map(d => (
                    <div key={d.index} className={`test-row ${d.status}`} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: 600 }}>Test {d.index}</div>
                        <div style={{ padding: "3px 8px", borderRadius: 6, background: d.status === 'passed' ? "#ecfdf5" : "#fff1f2", color: d.status === 'passed' ? "#065f46" : "#b91c1c" }}>
                          {d.status.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <div><strong>Input:</strong> <pre style={{ background: "#fff", padding: 8, borderRadius: 6 }}>{d.input}</pre></div>
                        <div><strong>Expected:</strong> <pre style={{ background: "#fff", padding: 8, borderRadius: 6 }}>{d.expected}</pre></div>
                        <div><strong>Output:</strong> <pre style={{ background: "#fff", padding: 8, borderRadius: 6 }}>{d.output}</pre></div>
                        {d.error && <div style={{ color: "red" }}><strong>Error:</strong> <pre>{d.error}</pre></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
