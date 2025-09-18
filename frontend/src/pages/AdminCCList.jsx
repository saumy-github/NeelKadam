import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * AdminCCList.jsx
 * - Shows generated Carbon Credits (CC)
 * - Create a new CC entry (mock)
 * - Object properties follow snake_case convention to align with the backend API contract
 */
export default function AdminCCList() {
  const [ccList, setCcList] = useState([
    {
      id: "CC-2025-001",
      project: "Mangrove Restoration",
      amount: 50,
      issued_to: "Mangrove Foundation",
      date: "2025-04-01",
    },
    {
      id: "CC-2025-002",
      project: "Seagrass Plantation",
      amount: 100,
      issued_to: "Coastal Care",
      date: "2025-06-12",
    },
  ]);

  const generateCC = () => {
    const next = {
      id: `CC-2025-${String(ccList.length + 1).padStart(3, "0")}`,
      project: "Manual Issuance",
      amount: 25,
      issued_to: "Manual",
      date: new Date().toISOString().slice(0, 10),
    };
    setCcList((prev) => [next, ...prev]);
    // TODO: POST /admin/cc/generate
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Carbon Credits (CC)</h2>
        <div className="flex gap-3">
          <button
            onClick={generateCC}
            className="px-4 py-2 bg-red-700 text-white rounded"
          >
            Generate New CC
          </button>
          <Link to="/admin/dashboard" className="text-sm underline">
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {ccList.map((cc) => (
          <div
            key={cc.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{cc.id}</h3>
              <p className="text-sm text-gray-600">
                {cc.project} • Issued to: {cc.issued_to}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">{cc.amount} CC</p>
              <p className="text-sm text-gray-500">{cc.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
