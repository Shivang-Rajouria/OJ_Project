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
