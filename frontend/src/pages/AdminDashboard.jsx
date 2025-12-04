import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function AdminDashboard({ user }) {
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [newEmp, setNewEmp] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [slip, setSlip] = useState({
    employee_id: "",
    month: "",
    basic: "",
    allowances: "",
    deductions: "",
  });

  // ---------------------------
  // LOAD DATA
  // ---------------------------
  const loadData = async () => {
    const empRes = await api.get("/admin/employees");
    const expRes = await api.get("/admin/expenses/pending");

    // Attach employee name to expense
    const Mapped = expRes.data.map((e) => {
      const emp = empRes.data.find((x) => x.id === e.employee_id);
      return {
        ...e,
        employee_name: emp ? emp.full_name || emp.email : "Unknown",
      };
    });

    setEmployees(empRes.data);
    setExpenses(Mapped);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------------------
  // ADD EMPLOYEE
  // ---------------------------
  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", newEmp);

      alert("Employee created successfully!");

      setNewEmp({
        full_name: "",
        email: "",
        password: "",
        role: "employee",
      });

      loadData();
    } catch (err) {
      alert("Failed to create employee");
    }
  };

  // ---------------------------
  // CREATE SALARY SLIP
  // ---------------------------
  const createSlip = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/salary-slip", {
        employee_id: slip.employee_id,
        month: slip.month,
        basic: Number(slip.basic),
        allowances: Number(slip.allowances),
        deductions: Number(slip.deductions),
      });

      alert("Salary slip created!");

      setSlip({
        employee_id: "",
        month: "",
        basic: "",
        allowances: "",
        deductions: "",
      });
    } catch (err) {
      alert("Failed to create salary slip");
    }
  };

  // ---------------------------
  // APPROVE / REJECT EXPENSE
  // ---------------------------
  const handleAction = async (id, action) => {
    await api.post(`/admin/expenses/${id}/action?action=${action}`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Admin Dashboard
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500">Total Employees</h3>
            <p className="text-3xl font-semibold text-slate-800">
              {employees.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500">Total Expenses</h3>
            <p className="text-3xl font-semibold text-slate-800">
              ₹{expenses.reduce((a, b) => a + b.amount, 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500">
            <h3 className="text-sm text-gray-500">Pending Approvals</h3>
            <p className="text-3xl font-semibold text-slate-800">
              {expenses.filter((e) => e.status === "pending").length}
            </p>
          </div>
        </div>

        {/* ADD EMPLOYEE */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            ➕ Add New Employee
          </h2>

          <form onSubmit={addEmployee} className="grid md:grid-cols-2 gap-4">
            <input
              className="p-3 border rounded-lg"
              placeholder="Full Name"
              value={newEmp.full_name}
              onChange={(e) =>
                setNewEmp({ ...newEmp, full_name: e.target.value })
              }
              required
            />

            <input
              className="p-3 border rounded-lg"
              placeholder="Email"
              value={newEmp.email}
              onChange={(e) =>
                setNewEmp({ ...newEmp, email: e.target.value })
              }
              required
            />

            <input
              className="p-3 border rounded-lg"
              type="password"
              placeholder="Password"
              value={newEmp.password}
              onChange={(e) =>
                setNewEmp({ ...newEmp, password: e.target.value })
              }
              required
            />

            <select
              className="p-3 border rounded-lg"
              value={newEmp.role}
              onChange={(e) =>
                setNewEmp({ ...newEmp, role: e.target.value })
              }
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            <button className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
              Create Employee
            </button>
          </form>
        </section>

        {/* CREATE SALARY SLIP */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            📄 Create Salary Slip
          </h2>

          <form onSubmit={createSlip} className="grid md:grid-cols-2 gap-4">
            <select
              className="p-3 border rounded-lg"
              value={slip.employee_id}
              onChange={(e) =>
                setSlip({ ...slip, employee_id: e.target.value })
              }
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name || emp.email}
                </option>
              ))}
            </select>

            <input
              type="month"
              className="p-3 border rounded-lg"
              value={slip.month}
              onChange={(e) =>
                setSlip({ ...slip, month: e.target.value })
              }
              required
            />

            <input
              className="p-3 border rounded-lg"
              placeholder="Basic Salary"
              value={slip.basic}
              onChange={(e) =>
                setSlip({ ...slip, basic: e.target.value })
              }
              required
            />

            <input
              className="p-3 border rounded-lg"
              placeholder="Allowances"
              value={slip.allowances}
              onChange={(e) =>
                setSlip({ ...slip, allowances: e.target.value })
              }
            />

            <input
              className="p-3 border rounded-lg"
              placeholder="Deductions"
              value={slip.deductions}
              onChange={(e) =>
                setSlip({ ...slip, deductions: e.target.value })
              }
            />

            <button className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
              Create Salary Slip
            </button>
          </form>
        </section>

        {/* EXPENSE TABLE */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            Employee Expenses
          </h2>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600">
                <th className="p-3">Employee</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{exp.employee_name}</td>
                  <td className="p-3">{exp.category}</td>
                  <td className="p-3">₹{exp.amount}</td>

                  <td className="p-3">
                    <span
                      className={
                        "px-3 py-1 rounded-lg text-sm font-semibold " +
                        (exp.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : exp.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700")
                      }
                    >
                      {exp.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3">
                    {exp.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(exp.id, "approve")}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(exp.id, "reject")}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </section>
      </div>
    </div>
  );
}
