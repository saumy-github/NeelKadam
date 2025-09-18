import { Link, useNavigate } from "react-router-dom";

export default function NGODashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
  localStorage.clear();  // optional if you store tokens
  sessionStorage.clear(); // optional if you store sessions

  alert("Signed out successfully!");
  window.location.href = "/"; // ✅ force redirect to landing page
};


  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3]">
      {/* ✅ Taskbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">NGO Dashboard</h1>
        <ul className="flex gap-6 text-sm font-medium items-center">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/ngo/profile" className="hover:underline">Profile</Link></li>
          <li><Link to="/blog" className="hover:underline">Blog</Link></li>
        </ul>
      </nav>

      {/* ✅ Main content area */}
      <main className="flex-grow p-8 space-y-10 overflow-y-auto">
        {/* Welcome */}
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>

        {/* ✅ Project Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">Total Projects</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">Pending Approval</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">4</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">Verified CC Earned</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">350</p>
          </div>
        </div>

        {/* ✅ Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/ngo/upload-project"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">📤 Upload Project</h4>
              <p className="text-gray-600">Submit your new project for approval.</p>
            </Link>

            <Link
              to="/ngo/past-projects"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">📂 Past Projects</h4>
              <p className="text-gray-600">View your approved and pending projects here.</p>
            </Link>

            <Link
              to="/ngo/sell-cc"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">💰 Sell CC</h4>
              <p className="text-gray-600">Sell your carbon credits securely.</p>
            </Link>
          </div>
        </div>

        {/* ✅ Recent Activity */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="bg-white p-6 rounded-xl shadow space-y-4 max-h-64 overflow-y-auto">
            <p className="text-sm text-gray-700">✅ Project "Mangrove Restoration" approved.</p>
            <p className="text-sm text-gray-700">⚠️ Project "Seagrass Plantation" pending verification.</p>
            <p className="text-sm text-gray-700">💰 50 CC credited to your wallet.</p>
            <p className="text-sm text-gray-700">📤 New project uploaded: "Coastal Cleanup Drive".</p>
            <p className="text-sm text-gray-700">⏳ Project "Coral Reef Initiative" under review.</p>
          </div>
        </div>

        {/* ✅ Upcoming Tasks */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Tasks</h3>
          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <div className="flex items-center justify-between">
              <span>Upload project photos with geo-tag</span>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Done
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Update NGO profile documents</span>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Done
              </button>
            </div>
          </div>
        </div>

        

      </main>
    </div>
  );
}
