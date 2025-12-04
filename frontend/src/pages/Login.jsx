import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setToken } from "../api";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginRes = await api.post(
        "/auth/login",
        new URLSearchParams({
          username: email,
          password: password,
        })
      );

      const token = loginRes.data.access_token;

      // ⛔ Set token BEFORE calling /auth/me
      setToken(token);
      localStorage.setItem("token", token);

      // Get logged-in user
      const meRes = await api.get("/auth/me");
      const user = meRes.data;

      onAuth(user, token);

      navigate(user.role === "admin" ? "/admin" : "/employee");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#38bdf8,_transparent_60%),_radial-gradient(circle_at_bottom,_#1d4ed8,_transparent_55%)]"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-xl p-8">
        {/* Header with icon */}
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Anshumat Payroll Portal
            </h1>
            <p className="text-xs text-slate-500">
              Secure access for employees & admins
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-slate-800">Login</h2>

        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
      <div className="absolute bottom-4 left-0 w-full text-center">
        <p className="text-gray-300 text-sm tracking-wide">
          Designed & Developed by <span className="font-semibold">Mirza Mehraj Baig</span>
        </p>
      </div>
    </div>
  );
}
