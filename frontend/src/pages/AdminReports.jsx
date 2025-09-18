import { Link } from "react-router-dom";

/**
 * AdminReports.jsx
 * - Simple summary + CSV export for demo
 */
export default function AdminReports() {
  const sampleData = [
    { id: 1, type: "NGO", name: "Mangrove Foundation", projects: 5 },
    { id: 2, type: "Buyer", name: "Example Corp", creditsBought: 120 },
  ];

  const downloadCSV = () => {
    const headers = Object.keys(sampleData[0]).join(",");
    const rows = sampleData.map(r => Object.values(r).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Reports</h2>
        <Link to="/admin/dashboard" className="text-sm underline">Back</Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4">Quick summary & CSV export for offline analysis.</p>
        <button onClick={downloadCSV} className="px-4 py-2 bg-red-700 text-white rounded">Download CSV</button>
      </div>
    </div>
  );
}
