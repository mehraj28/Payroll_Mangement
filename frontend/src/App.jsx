import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import api, { setToken } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // LOAD USER FROM TOKEN ON START
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    setToken(token);

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // -----------------------------
  // SHOW LOADING (very important)
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // -----------------------------
  // ROUTES
  // -----------------------------
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/employee"} />
          ) : (
            <Login
              onAuth={(u, t) => {
                setUser(u);
                setToken(t);
                localStorage.setItem("token", t);

                window.location.href = u.role === "admin" ? "/admin" : "/employee";
              }}
            />
          )
        }
      />

      {/* SIGNUP */}
      <Route path="/signup" element={<Signup />} />

      {/* EMPLOYEE DASHBOARD */}
      <Route
        path="/employee"
        element={
          user ? (
            user.role === "employee" ? (
              <EmployeeDashboard user={user} />
            ) : (
              <Navigate to="/admin" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          user ? (
            user.role === "admin" ? (
              <AdminDashboard user={user} />
            ) : (
              <Navigate to="/employee" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* DEFAULT ROUTE */}
      <Route
        path="/"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/employee" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* 404 FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
