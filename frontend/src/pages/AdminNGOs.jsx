import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminNGOs() {
  const [sellers, setSellers] = useState([
    { id: 1, name: "Mangrove Foundation", license: "LIC123456", email: "seller@example.com", status: "pending" },
    { id: 2, name: "Coastal Care", license: "LIC987654", email: "coast@example.com", status: "verified" },
    { id: 3, name: "Green Shores", license: "LIC112233", email: "green@example.com", status: "blocked" },
  ]);

  const changeStatus = (id, status) => {
    setSellers((prev) => prev.map(s => s.id === id ? { ...s, status } : s));
    // TODO: call backend: POST /admin/sellers/:id/status { status }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Registered Sellers</h2>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:underline font-semibold text-lg">
          ← Back to Admin
        </Link>
      </div>

      <div className="space-y-6">
        {sellers.map((s) => (
          <div
            key={s.id}
            className="bg-white p-6 rounded-2xl shadow-lg flex justify-between items-center border-l-8 border-indigo-500 hover:shadow-xl transition"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{s.name}</h3>
              <p className="text-sm text-gray-600">
                License: <span className="font-mono">{s.license}</span> • <span className="underline">{s.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  s.status === "verified"
                    ? "bg-green-100 text-green-800"
                    : s.status === "blocked"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
              </span>

              {s.status !== "verified" && s.status !== "blocked" && (
                <button
                  onClick={() => changeStatus(s.id, "verified")}
                  className="px-4 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition"
                >
                  Verify
                </button>
              )}
              {s.status !== "blocked" && (
                <button
                  onClick={() => changeStatus(s.id, "blocked")}
                  className="px-4 py-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
                >
                  Block
                </button>
              )}
              {s.status === "blocked" && (
                <button
                  onClick={() => changeStatus(s.id, "pending")}
                  className="px-4 py-2 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 transition"
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
