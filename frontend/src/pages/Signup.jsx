// import React, { useState } from "react";
// import api from "../api";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("employee");
//   const [msg, setMsg] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     try {
//       await api.post("/auth/signup", {
//         email,
//         password,
//         full_name: name,
//         role,
//       });

//       setMsg("User created! Redirecting to login...");

//       // Redirect to login page after short delay
//       setTimeout(() => {
//         navigate("/login");
//       }, 1200);

//     } catch (e) {
//       setMsg("Error creating user");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded shadow">
//       <h2 className="text-xl mb-4">Signup</h2>

//       <form onSubmit={submit} className="space-y-4">
//         <input
//           className="w-full p-2 border"
//           placeholder="Full name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <input
//           className="w-full p-2 border"
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           className="w-full p-2 border"
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <select
//           className="w-full p-2 border"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="employee">Employee</option>
//           <option value="admin">Admin</option>
//         </select>

//         <button className="w-full bg-green-600 text-white p-2 rounded">
//           Sign up
//         </button>
//       </form>

//       {msg && <p className="mt-3 text-center">{msg}</p>}
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/auth/signup", {
        full_name,
        email,
        password,
        role: role.toLowerCase()
      });
      setMsg("Account created. You can now login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg("Failed to create account (email may already exist).");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#38bdf8,_transparent_60%),_radial-gradient(circle_at_bottom,_#1d4ed8,_transparent_55%)]" />

      <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Anshumat Payroll Portal</h1>
            <p className="text-xs text-slate-500">Create your employee/admin account</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-slate-800">Sign Up</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {msg && <p className="text-sm text-center text-slate-700">{msg}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
