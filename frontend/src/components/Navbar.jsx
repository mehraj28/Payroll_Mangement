import React from "react";

export default function Navbar({ user }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
          <span className="font-bold">A</span>
        </div>
        <div>
          <div className="font-semibold text-sm">Anshumat Payroll</div>
          <div className="text-xs text-slate-300">Secure HR & Salary System</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="text-sm text-slate-200">
            {user.full_name || user.email}{" "}
            <span className="text-xs text-slate-400 uppercase ml-1">({user.role})</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-xs font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
