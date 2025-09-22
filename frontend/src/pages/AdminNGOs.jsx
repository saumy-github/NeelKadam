import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * AdminNGOs.jsx
 * - Shows registered NGOs
 * - Verify / Unverify / Block actions
 * - Replace mock data with API calls (GET /admin/ngos, POST /admin/ngo/:id/block, etc.)
 */
export default function AdminNGOs() {
  const [ngos, setNgos] = useState([
    { id: 1, name: "Mangrove Foundation", license: "LIC123456", email: "ngo@example.com", status: "pending" },
    { id: 2, name: "Coastal Care", license: "LIC987654", email: "coast@example.com", status: "verified" },
    { id: 3, name: "Green Shores", license: "LIC112233", email: "green@example.com", status: "blocked" },
  ]);

  const changeStatus = (id, status) => {
    setNgos((prev) => prev.map(n => n.id === id ? { ...n, status } : n));
    // TODO: call backend: POST /admin/ngo/:id/status { status }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registered NGOs</h2>
        <Link to="/admin/dashboard" className="text-sm underline">Back to Admin</Link>
      </div>

      <div className="grid gap-4">
        {ngos.map((n) => (
          <div key={n.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{n.name}</h3>
              <p className="text-sm text-gray-600">License: {n.license} • {n.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-sm ${n.status === 'verified' ? 'bg-green-100 text-green-700' : n.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {n.status}
              </span>

              {n.status !== "verified" && n.status !== "blocked" && (
                <button onClick={() => changeStatus(n.id, "verified")} className="px-3 py-1 bg-green-600 text-white rounded">Verify</button>
              )}
              {n.status !== "blocked" && (
                <button onClick={() => changeStatus(n.id, "blocked")} className="px-3 py-1 bg-red-600 text-white rounded">Block</button>
              )}
              {n.status === "blocked" && (
                <button onClick={() => changeStatus(n.id, "pending")} className="px-3 py-1 bg-gray-600 text-white rounded">Unblock</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
