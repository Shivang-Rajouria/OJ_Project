import React, { useEffect, useState } from "react";
import { backendAxios } from "../api/axios";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  // Starter codes for each language
  function getStarterCode(lang) {
    if (lang === "python")
      return `# Read input and print result\n# Example:\n# a, b = map(int, input().split())\n# print(a + b)\n`;
    return `#include <iostream>\nusing namespace std;\nint main() {\n    // read input and write output\n    return 0;\n}\n`;
  }

  // Load problem and set starter code when problem or language changes
  useEffect(() => {
    if (!id) return;
    backendAxios.get(`/api/problems/${id}`)
      .then(res => {
        setProblem(res.data);
        setCode(getStarterCode(language));
        setResults(null);
        setCustomInput("");
      })
      .catch(() => alert("Failed to load problem"));
  }, [id]);

  // Reset code snippet when language changes IF code is empty or is starter code
  useEffect(() => {
    if (!problem) return;
    // Reset only if code is empty or unchanged starter code from previous language
    if (!code || code.trim() === "" || code === getStarterCode(language === "python" ? "cpp" : "python")) {
      setCode(getStarterCode(language));
      setResults(null);
    }
  }, [language]);

  // Run on custom input only
  const runCustomInput = async () => {
    if (!problem) return;
    setRunning(true);
    setResults(null);
    try {
      const payload = {
        problemId: problem._id,
        code,
        language,
        customInput, // send custom input separately, backend can detect
        runType: "run" // flag to distinguish run from submit
      };
      const res = await backendAxios.post("/api/run", payload, { timeout: 120000 });
      setResults(res.data);
    } catch (err) {
      setResults({ error: err.response?.data || err.message });
    } finally {
      setRunning(false);
    }
  };

  // Submit for all test cases
  const submitCode = async () => {
    if (!problem) return;
    setRunning(true);
    setResults(null);
    try {
      const payload = {
        problemId: problem._id,
        code,
        language,
        runType: "submit" // distinguish submit call
      };
      const res = await backendAxios.post("/api/run", payload, { timeout: 120000 });
      setResults(res.data);
    } catch (err) {
      setResults({ error: err.response?.data || err.message });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="editor-layout">
      {/* Left panel: Problem description */}
      <div className="left card" style={{ overflowY: "auto", maxHeight: "80vh", paddingRight: 12 }}>
        {!problem ? <div>Loading...</div> : (
          <>
            <h2 style={{ marginBottom: 6 }}>{problem.title}</h2>
            <div style={{ color: "#6b7280", marginBottom: 12 }}>Tests: {problem.testCases?.length || 0}</div>
            <div dangerouslySetInnerHTML={{ __html: problem.description || "" }} />
          </>
        )}
      </div>

      {/* Right panel: Editor, input, buttons, results */}
      <div className="right" style={{ display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
          <label style={{ color: "#6b7280" }}>Language</label>
          <select
            className="select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginLeft: 8, minWidth: 120 }}
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          <button
            className="btn"
            onClick={() => {
              setCode(getStarterCode(language));
              setResults(null);
              setCustomInput("");
            }}
            style={{ marginLeft: "auto" }}
          >
            Reset
          </button>
        </div>

        {/* Editor container with scroll */}
        <div className="card" style={{ flexGrow: 1, padding: 0, overflow: "hidden" }}>
          <Editor
            height="100%"
            language={language === "python" ? "python" : "cpp"}
            value={code}
            onChange={setCode}
            options={{ fontSize: 13, minimap: { enabled: false } }}
          />
        </div>

        {/* Custom input and buttons */}
        <div className="card" style={{ marginTop: 8, padding: 12 }}>
          <label htmlFor="customInput" style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
            Custom Input
          </label>
          <textarea
            id="customInput"
            className="input"
            rows={4}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom input here..."
          />

          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn" onClick={runCustomInput} disabled={running}>
              {running ? "Running..." : "Run"}
            </button>
            <button className="btn-primary" onClick={submitCode} disabled={running}>
              {running ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ marginTop: 12, overflowY: "auto", maxHeight: "200px" }}>
          {!results ? (
            <div style={{ color: "#6b7280" }}>Run or submit code to see results</div>
          ) : results.error ? (
            <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{JSON.stringify(results.error, null, 2)}</pre>
          ) : (
            <>
              {results.total !== undefined && (
                <div style={{ marginBottom: 8, fontWeight: 600 }}>
                  Passed: {results.passed} / {results.total}
                </div>
              )}
              <div>
                {(results.details || []).map((d) => (
                  <div
                    key={d.index}
                    className={`test-row ${d.status}`}
                    style={{ marginBottom: 8 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 600 }}>Test {d.index}</div>
                      <div
                        style={{
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: d.status === "passed" ? "#ecfdf5" : "#fff1f2",
                          color: d.status === "passed" ? "#065f46" : "#b91c1c",
                        }}
                      >
                        {d.status.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <div><strong>Input:</strong> <pre style={{ background: "#fff", padding: 8, borderRadius: 6 }}>{d.input}</pre></div>
                      <div><strong>Expected:</strong> <pre style={{ background: "#fff", padding: 8, borderRadius: 6 }}>{d.expected}</pre></div>
                      <div><strong>Output:</strong> <pre style={{ background: "#fff", padding: 8, borderRadius: 6 }}>{d.output}</pre></div>
                      {d.error && (
                        <div style={{ color: "red" }}>
                          <strong>Error:</strong> <pre>{d.error}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
