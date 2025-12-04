import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function EmployeeDashboard({ user }) {
  const [slips, setSlips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    category: "Travel",
    amount: "",
    description: "",
  });

  // ---------------------------------------------------
  // LOAD SALARY SLIPS + EXPENSES
  // ---------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const s = await api.get("/employee/salary-slip");
        const e = await api.get("/employee/expense");

        setSlips(s.data);
        setExpenses(e.data);
      } catch (err) {
        console.error("Failed loading data:", err);
      }
    };
    load();
  }, []);

  // ---------------------------------------------------
  // DOWNLOAD PDF
  // ---------------------------------------------------
  const downloadPDF = async (slipId) => {
    try {
      const res = await api.get(`/employee/salary-slip/${slipId}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `salary-slip-${slipId}.pdf`;
      a.click();
    } catch (err) {
      alert("Failed to download PDF");
    }
  };

  // ---------------------------------------------------
  // SUBMIT EXPENSE
  // ---------------------------------------------------
  const submitExpense = async (e) => {
    e.preventDefault();
    try {
      const result = await api.post("/employee/expense", {
        category: form.category,
        amount: parseFloat(form.amount),
        description: form.description,
      });

      setExpenses([result.data, ...expenses]);
      setForm({ category: "Travel", amount: "", description: "" });
    } catch (err) {
      alert("Failed to submit expense");
    }
  };

  // ---------------------------------------------------
  // CHART DATA
  // ---------------------------------------------------
  const months = slips.map((s) => s.month);
  const pay = slips.map((s) => s.net_pay);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        borderRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: "#334155", font: { size: 13 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b", font: { size: 12 } },
        grid: { color: "#e2e8f0", drawBorder: false },
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Net Pay",
        data: pay,
        borderRadius: 12,
        borderSkipped: false,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(37, 99, 235, 0.9)");
          gradient.addColorStop(1, "rgba(37, 99, 235, 0.4)");
          return gradient;
        },
      },
    ],
  };

  // ---------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {user.full_name || user.email}
        </h1>
        <p className="text-gray-500 mb-8">
          Employee Salary & Expense Dashboard
        </p>

        {/* ---------------------------------------------------
            SALARY SLIPS
        --------------------------------------------------- */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            Salary Slips
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2">Month</th>
                <th className="p-2">Net Pay</th>
                <th className="p-2">PDF</th>
              </tr>
            </thead>

            <tbody>
              {slips.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No salary slips available
                  </td>
                </tr>
              )}

              {slips.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{s.month}</td>
                  <td className="p-2 font-medium text-slate-700">
                    ₹{s.net_pay}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => downloadPDF(s.id)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Salary History Chart */}
          {slips.length > 0 && (
            <div className="mt-8 h-[350px] bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">
                Salary History
              </h3>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* ---------------------------------------------------
            EXPENSE + HISTORY
        --------------------------------------------------- */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* SUBMIT EXPENSE FORM */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Submit Expense
            </h2>

            <form onSubmit={submitExpense} className="space-y-4">
              <select
                className="w-full p-3 border rounded-lg"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Travel</option>
                <option>Food</option>
                <option>Medical</option>
                <option>Supplies</option>
              </select>

              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Amount"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />

              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
                Submit
              </button>
            </form>
          </div>

          {/* EXPENSE HISTORY */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Expense History
            </h2>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2">Date</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {new Date(e.date).toLocaleString()}
                    </td>
                    <td className="p-2">{e.category}</td>
                    <td className="p-2 font-medium">₹{e.amount}</td>

                    <td className="p-2">
                      <span
                        className={
                          "px-2 py-1 rounded text-sm " +
                          (e.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : e.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700")
                        }
                      >
                        {e.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
