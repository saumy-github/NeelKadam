import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminTransactions() {
  const [txs, setTxs] = useState([
    {
      id: 1,
      from: "Mangrove Foundation",
      to: "Example Corp",
      amount: "50 CC",
      date: "2025-07-01",
      status: "completed",
      flagged: false,
    },
    {
      id: 2,
      from: "Seagrass",
      to: "GreenTech",
      amount: "40 CC",
      date: "2025-07-03",
      status: "pending",
      flagged: false,
    },
  ]);

  const toggleFlag = (id) =>
    setTxs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, flagged: !t.flagged } : t))
    );

  const blockUser = (name) => {
    alert(`User ${name} will be blocked (mock).`);
    // TODO: POST /admin/block-user { name }
  };

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-8 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">All Transactions</h2>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:underline font-semibold text-lg">
          ← Back to Admin
        </Link>
      </div>

      <div className="space-y-6">
        {txs.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl p-6 shadow-lg border-l-8 border-indigo-600 hover:shadow-2xl transition flex justify-between items-center flex-wrap gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg truncate">
                {t.from} → {t.to}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {t.amount} • {t.date} •{" "}
                <span
                  className={`font-semibold ${
                    t.status === "completed"
                      ? "text-green-700"
                      : t.status === "pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-end flex-shrink-0">
              <button
                onClick={() => toggleFlag(t.id)}
                className={`px-5 py-2 rounded-full shadow font-semibold transition ${
                  t.flagged
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t.flagged ? "Flagged" : "Flag"}
              </button>

              <button
                onClick={() => blockUser(t.from)}
                className="px-5 py-2 rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition font-semibold"
              >
                Block Sender
              </button>

              <button
                onClick={() => blockUser(t.to)}
                className="px-5 py-2 rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition font-semibold"
              >
                Block Receiver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
