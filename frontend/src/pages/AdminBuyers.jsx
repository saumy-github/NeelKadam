import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminBuyers() {
  const [buyers, setBuyers] = useState([
    {
      id: 1,
      name: "Example Corp",
      email: "buyer@example.com",
      status: "active",
      total_credits: 120,
    },
    {
      id: 2,
      name: "GreenTech Ltd.",
      email: "gt@example.com",
      status: "suspended",
      total_credits: 450,
    },
  ]);

  const toggleBlock = (id) => {
    setBuyers((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "active" ? "suspended" : "active" }
          : b
      )
    );
    // TODO: POST /admin/buyer/:id/block
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Registered Buyers</h2>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:underline font-semibold text-lg">
          ← Back to Admin
        </Link>
      </div>

      <div className="space-y-6">
        {buyers.map((b) => (
          <div
            key={b.id}
            className="bg-white p-6 rounded-2xl shadow-lg flex justify-between items-center border-l-8 border-indigo-500 hover:shadow-xl transition"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{b.name}</h3>
              <p className="text-sm text-gray-600">
                <span className="underline">{b.email}</span> • Credits:{" "}
                <span className="font-semibold">{b.total_credits}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  b.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </span>
              <button
                onClick={() => toggleBlock(b.id)}
                className={`px-4 py-2 rounded-full shadow-md text-white transition hover:brightness-90 ${
                  b.status === "active" ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {b.status === "active" ? "Block" : "Unblock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
