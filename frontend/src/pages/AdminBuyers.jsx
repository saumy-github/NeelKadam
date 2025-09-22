import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * AdminBuyers.jsx
 * - Show buyer registrations
 * - Block/unblock buyer
 * - View quick stats and last transactions preview
 * - Using snake_case for data properties to match backend API contract
 */
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
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Registered Buyers</h2>
        <Link to="/admin/dashboard" className="text-sm underline">
          Back to Admin
        </Link>
      </div>

      <div className="grid gap-4">
        {buyers.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{b.name}</h3>
              <p className="text-sm text-gray-600">
                {b.email} • Credits: {b.total_credits}
              </p>
            </div>

            <div className="flex gap-3">
              <span
                className={`px-2 py-1 rounded text-sm ${
                  b.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {b.status}
              </span>
              <button
                onClick={() => toggleBlock(b.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
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
