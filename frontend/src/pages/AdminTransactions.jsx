import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * AdminTransactions.jsx
 * - List of transactions
 * - Flag discrepancy & block associated user
 * - Using snake_case for data properties to match backend API contract
 */
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
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">All Transactions</h2>
        <Link to="/admin/dashboard" className="text-sm underline">
          Back to Admin
        </Link>
      </div>

      <div className="space-y-4">
        {txs.map((t) => (
          <div
            key={t.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {t.from} → {t.to}
              </p>
              <p className="text-sm text-gray-600">
                {t.amount} • {t.date} • {t.status}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => toggleFlag(t.id)}
                className={`px-3 py-1 rounded ${
                  t.flagged ? "bg-yellow-600 text-white" : "bg-gray-100"
                }`}
              >
                {t.flagged ? "Flagged" : "Flag"}
              </button>
              <button
                onClick={() => blockUser(t.from)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Block Sender
              </button>
              <button
                onClick={() => blockUser(t.to)}
                className="px-3 py-1 bg-red-600 text-white rounded"
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
