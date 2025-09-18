import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * AdminProjects.jsx
 * - List of projects submitted by NGOs
 * - Inspect details, approve/reject, add notes
 */
export default function AdminProjects() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Mangrove Restoration", ngo: "Mangrove Foundation", status: "under_review", requestedCC: 100, notes: "" },
    { id: 2, name: "Seagrass Plantation", ngo: "Coastal Care", status: "verified", requestedCC: 200, notes: "" },
  ]);

  const updateStatus = (id, status) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    // TODO: POST /admin/project/:id/status
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Project Verification</h2>
        <Link to="/admin/dashboard" className="text-sm underline">Back to Admin</Link>
      </div>

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">NGO: {p.ngo} • Requested CC: {p.requestedCC}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`px-2 py-1 rounded text-sm ${p.status === 'verified' ? 'bg-green-100 text-green-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.status}
                </span>
                {p.status === "under_review" && (
                  <>
                    <button onClick={() => updateStatus(p.id, "verified")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                    <button onClick={() => updateStatus(p.id, "rejected")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <p>Notes: {p.notes || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
