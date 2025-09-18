export default function Admin() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-800 mb-6">🛡️ Admin Dashboard</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">Pending Verifications</h2>
        <p className="text-gray-600 mt-2">No pending projects.</p>
      </div>
    </div>
  );
}
