import { Link } from "react-router-dom";

export default function AdminReports() {
  const sampleData = [
    {
      seller_id: 1,
      seller_type: "ngo",
      entity_name: "Mangrove Foundation",
      project_count: 5,
    },
    {
      buyer_id: 2,
      entity_type: "buyer",
      entity_name: "Example Corp",
      total_cc: 120,
    },
  ];

  const downloadCSV = () => {
    const headers = Object.keys(sampleData[0]).join(",");
    const rows = sampleData.map((r) => Object.values(r).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-10 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Reports</h2>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:underline font-semibold text-lg">
          ← Back
        </Link>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-lg space-y-6">
        <p className="text-lg text-gray-700">
          Quick summary & export your data as CSV for offline analysis.
        </p>
        <button
          onClick={downloadCSV}
          className="px-8 py-4 bg-red-700 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-400 transition"
          type="button"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}
