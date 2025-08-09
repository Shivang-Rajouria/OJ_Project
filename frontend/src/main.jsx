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
