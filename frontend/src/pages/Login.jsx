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
