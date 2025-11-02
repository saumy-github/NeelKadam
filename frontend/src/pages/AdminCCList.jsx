import { useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="max-w-6xl mx-auto p-10 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Carbon Credits (CC)</h2>
        <div className="flex gap-6">
          <button
            onClick={generateCC}
            className="px-6 py-3 bg-red-700 text-white rounded-3xl font-semibold shadow-md hover:bg-red-800 transition"
          >
            Generate New CC
          </button>
          <Link
            to="/admin/dashboard"
            className="text-indigo-600 hover:underline font-semibold text-lg"
          >
            ← Back
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {ccList.map((cc) => (
          <div
            key={cc.id}
            className="bg-white rounded-3xl p-6 shadow-lg border-l-8 border-indigo-600 flex justify-between items-center hover:shadow-xl transition"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{cc.id}</h3>
              <p className="text-gray-600 text-sm">
                {cc.project} • Issued to: <span className="font-medium">{cc.issued_to}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-indigo-600">{cc.amount} CC</p>
              <p className="text-gray-500 text-sm">{cc.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
