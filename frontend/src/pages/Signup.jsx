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
