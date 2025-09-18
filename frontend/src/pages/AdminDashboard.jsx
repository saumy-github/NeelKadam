import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    alert("Signed out successfully!");
    navigate("/login/admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3]">
      {/* ✅ Admin Header */}
      <nav className="bg-red-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <ul className="flex gap-6 text-sm font-medium">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/admin/profile" className="hover:underline">Profile</Link></li>
          <li><Link to="/blog" className="hover:underline">Blog</Link></li>
          <li><Link to="/admin/ngos" className="hover:underline">NGOs</Link></li>
          <li><Link to="/admin/buyers" className="hover:underline">Buyers</Link></li>
          <li><Link to="/admin/projects" className="hover:underline">Projects</Link></li>
          {/* ❌ Removed CC List, Transactions, Reports from header */}
        </ul>
      </nav>

      {/* ✅ Main Content */}
      <main className="flex-grow p-8 space-y-10 overflow-y-auto">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Welcome, Admin</h2>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-red-700">Total NGOs</h3>
            <p className="text-3xl font-bold mt-2">54</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-red-700">Total Buyers</h3>
            <p className="text-3xl font-bold mt-2">78</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-red-700">Total Projects</h3>
            <p className="text-3xl font-bold mt-2">132</p>
          </div>
        </div>

        {/* Management Panels */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">NGO Management</h3>
            <p className="text-gray-700 mb-4">View, verify, and manage registered NGOs.</p>
            <Link to="/admin/ngos" className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
              Manage NGOs
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Buyer Management</h3>
            <p className="text-gray-700 mb-4">Monitor buyer registrations and activities.</p>
            <Link to="/admin/buyers" className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
              Manage Buyers
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Project Verification</h3>
            <p className="text-gray-700 mb-4">Check NGO project status and approvals.</p>
            <Link to="/admin/projects" className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
              Verify Projects
            </Link>
          </div>
        </div>

        {/* Additional Panels for CC, Transactions, Reports */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Carbon Credits</h3>
            <p className="text-gray-700 mb-4">Track newly generated CC and listings.</p>
            <Link to="/admin/cc" className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
              View CC List
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Transactions</h3>
            <p className="text-gray-700 mb-4">Keep a check on all CC transactions.</p>
            <Link to="/admin/transactions" className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
              Monitor Transactions
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Reports</h3>
            <p className="text-gray-700 mb-4">Generate and review detailed reports.</p>
            <Link to="/admin/reports" className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
              View Reports
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <div className="flex justify-center mt-10">
  <button
    onClick={() => {
      localStorage.clear();
      sessionStorage.clear();
      alert("Signed out successfully!");
      window.location.href = "/"; // ✅ always go to main home page
    }}
    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Sign Out
  </button>
</div>

      </main>
    </div>
  );
}
