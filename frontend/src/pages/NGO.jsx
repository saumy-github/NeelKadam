export default function NGO() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-800 mb-6">🌱 NGO Dashboard</h1>
      <button className="bg-green-600 px-4 py-2 rounded-lg text-white mb-4 hover:bg-green-500">
        Upload Project Data
      </button>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">My Projects</h2>
        <p className="text-gray-600 mt-2">No projects uploaded yet.</p>
      </div>
    </div>
  );
}
