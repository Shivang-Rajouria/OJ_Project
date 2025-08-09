# create_frontend_with_monaco.ps1
# Usage: run this in PowerShell from OJ_Project\OJ_Project folder:
#   ./create_frontend_with_monaco.ps1
# If execution blocked, run:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

$root = Join-Path (Get-Location) "frontend"

if (Test-Path $root) {
  Write-Host "`nfrontend folder already exists at $root." -ForegroundColor Yellow
  $resp = Read-Host "Do you want to overwrite it? (yes/no)"
  if ($resp -ne "yes") {
    Write-Host "Aborting. No changes made." -ForegroundColor Red
    exit 1
  } else {
    Write-Host "Removing existing frontend folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $root
  }
}

New-Item -ItemType Directory -Path $root | Out-Null
Set-Location $root

function Write-FileContent($path, $content) {
  $dir = Split-Path $path -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $content | Out-File -FilePath $path -Encoding UTF8 -Force
}

Write-Host "Creating project files..." -ForegroundColor Cyan

# package.json
Write-FileContent "package.json" @'
{
  "name": "branchbench-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.4.7",
    "vite": "^5.1.0"
  }
}
'@

# vite.config.js
Write-FileContent "vite.config.js" @'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
'@

# index.html
Write-FileContent "index.html" @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>BranchBench</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@

# tailwind.config.cjs
Write-FileContent "tailwind.config.cjs" @'
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
'@

# postcss.config.cjs
Write-FileContent "postcss.config.cjs" @'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
'@

# .env
Write-FileContent ".env" @'
VITE_BACKEND_URL=http://localhost:5000
VITE_COMPILER_URL=http://localhost:8000
'@

# src/main.jsx
Write-FileContent "src/main.jsx" @'
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProblemPage from "./pages/ProblemPage";
import AppLayout from "./components/AppLayout";
import "./styles.css";

function Protected({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route index element={<Home />} />
        </Route>

        <Route
          path="/problems/:id"
          element={
            <Protected>
              <AppLayout />
              <ProblemPage />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
'@

# src/styles.css
Write-FileContent "src/styles.css" @'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* small customizations */
body { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background: #f4f7fb; color: #0f172a; }
.container { max-width: 1100px; margin: 28px auto; padding: 0 16px; }

/* header */
.header { background: linear-gradient(90deg,#0b2a4a,#0f172a); color: white; padding: 12px 20px; box-shadow: 0 6px 20px rgba(2,6,23,0.08); }
.header .brand { font-weight:700; font-size:18px; cursor:pointer; }

/* cards */
.card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 10px 30px rgba(2,6,23,0.06); }

/* home grid */
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.problem-card { padding: 16px; border-radius: 10px; cursor: pointer; transition: transform .12s; }
.problem-card:hover { transform: translateY(-6px); box-shadow: 0 14px 36px rgba(2,6,23,0.06); }

/* editor layout */
.editor-layout { display: grid; grid-template-columns: 420px 1fr; gap: 20px; }
.left { }
.right { }

/* controls, editor, result */
.controls { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.editor-area { width:100%; height:420px; border-radius:8px; border:1px solid #e6edf6; padding:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace; font-size:13px; }

/* tests */
.test-row { border-radius:8px; padding:10px; margin-bottom:8px; border:1px solid #eef2ff; background: #fff; }
.test-row.passed { background: #f0fdf4; border-color:#bbf7d0; }
.test-row.failed { background: #fff1f2; border-color:#fecaca; }

.input, .select, .btn { padding:10px; border-radius:8px; border:1px solid #e6edf6; }
.btn-primary { background: linear-gradient(90deg,#1d4ed8,#2563eb); color:white; padding:10px 14px; border-radius:8px; }
'@

# src/api/axios.js
Write-FileContent "src/api/axios.js" @'
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";
const COMPILER = import.meta.env.VITE_COMPILER_URL || "";

const backendInstance = axios.create({
  baseURL: BACKEND,
  headers: { "Content-Type": "application/json" }
});

// auto attach token
backendInstance.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export { backendInstance as backendAxios, COMPILER };
'@

# src/api/auth.js
Write-FileContent "src/api/auth.js" @'
import { backendAxios } from "./axios";

export const signup = (data) => backendAxios.post("/api/auth/signup", data);
export const login = (data) => backendAxios.post("/api/auth/login", data);
'@

# src/components/AppLayout.jsx
Write-FileContent "src/components/AppLayout.jsx" @'
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  return (
    <div>
      <header className="header">
        <div className="container" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div className="brand" onClick={() => navigate("/home")}>BranchBench</div>
          <div>
            <button className="btn" onClick={() => navigate("/home")}>Problems</button>
            <button onClick={logout} className="btn btn-primary" style={{marginLeft:12}}>Logout</button>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
'@

# src/pages/Signup.jsx
Write-FileContent "src/pages/Signup.jsx" @'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      alert("Signup successful. Please login.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.msg || err.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card" style={{ width: 420 }}>
        <h1 style={{fontSize:20, marginBottom:6}}>Create BranchBench account</h1>
        <p style={{color:"#6b7280", marginBottom:12}}>Join and start solving problems</p>

        <form onSubmit={onSubmit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <input className="input" name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          Already a member? <button className="btn" onClick={() => nav("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
}
'@

# src/pages/Login.jsx
Write-FileContent "src/pages/Login.jsx" @'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const token = res.data.token;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      nav("/home");
    } catch (err) {
      alert(err.response?.data?.msg || err.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card" style={{ width: 420 }}>
        <h1 style={{fontSize:20, marginBottom:6}}>Sign in</h1>
        <p style={{color:"#6b7280", marginBottom:12}}>Login to continue</p>

        <form onSubmit={onSubmit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          New here? <button className="btn" onClick={() => nav("/")}>Create account</button>
        </div>
      </div>
    </div>
  );
}
'@

# src/pages/Home.jsx
Write-FileContent "src/pages/Home.jsx" @'
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

      {loading ? <div className="card">Loading…</div> : (
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
'@

# src/pages/ProblemPage.jsx
Write-FileContent "src/pages/ProblemPage.jsx" @'
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
'@

Write-Host "Files created. Installing npm dependencies (this can take a minute)..." -ForegroundColor Green

npm install

Write-Host "`nDone. To start the dev server run:" -ForegroundColor Cyan
Write-Host "  cd $root" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host "`nMake sure your backend (and compiler) are running and that .env values point to correct ports." -ForegroundColor Magenta
Write-Host "If you want, I can also create a zip of this folder. Tell me if you want that next." -ForegroundColor Green
