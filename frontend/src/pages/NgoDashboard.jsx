import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SellCCModal from "../components/SellCCModal";
import useWalletConnect from "../hooks/useWalletConnect";
import dashboardApi from "../api/dashboard";

export default function NGODashboard() {
  const navigate = useNavigate();
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const { account, connectWallet } = useWalletConnect();

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("Signed out successfully!");
    window.location.href = "/";
  };


  const handleSellCCClick = async () => {
    if (!account) await connectWallet();
    setSellModalOpen(true);
  };


// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    setLoading(true);

    // Force refresh on dashboard page to always get latest data
    const response = await dashboardApi.getNgoDashboard(true);

    if (response.success) {
      setDashboardData(response.dashboard);
    } else {
      setError("Failed to fetch dashboard data");
    }
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    setError(err.message || "An error occurred while fetching dashboard data");
  } finally {
    setLoading(false);
  }
};

// Refresh dashboard after successful transfer
const handleTransferSuccess = () => {
  console.log("🔄 Refreshing dashboard after transfer...");
  // Clear cache to force fresh data
  dashboardApi.clearCache();
  // Fetch fresh data
  fetchDashboardData();
};

useEffect(() => {
  // Fetch dashboard data on mount
  fetchDashboardData();

  // No cleanup needed
  return () => {};
}, []);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* ✅ Taskbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Seller Dashboard</h1>
        <ul className="flex gap-6 text-sm font-medium items-center">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link to="/ngo/profile" className="hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:underline">
              Blog
            </Link>
          </li>
        </ul>
      </nav>


      {/* ✅ Main content area */}
      <main className="flex-grow px-8 py-10 space-y-10 overflow-y-auto">
        {/* Loading indicator */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          dashboardData && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, <span className="text-green-600">{dashboardData.profile?.ngo_name || "NGO User"}</span>
                </h2>
                <p className="text-gray-500 text-sm">Here's your carbon credit overview</p>
              </div>


              {/* ✅ Project Stats - Enhanced Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Total Projects
                      </h3>
                      <p className="text-5xl font-bold text-gray-900 mt-3">
                        {dashboardData.stats?.total_projects || 0}
                      </p>
                    </div>
                    <div className="text-4xl text-emerald-100 group-hover:scale-125 transition-transform">📊</div>
                  </div>
                  <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"></div>
                </div>

                <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-l-amber-500 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Pending Approval
                      </h3>
                      <p className="text-5xl font-bold text-amber-600 mt-3">
                        {dashboardData.stats?.pending_projects || 0}
                      </p>
                    </div>
                    <div className="text-4xl text-amber-100 group-hover:scale-125 transition-transform">⏳</div>
                  </div>
                  <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"></div>
                </div>

                <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Verified CC Earned
                      </h3>
                      <p className="text-5xl font-bold text-blue-600 mt-3">
                        {dashboardData.stats?.total_carbon_credits || 0}
                      </p>
                    </div>
                    <div className="text-4xl text-blue-100 group-hover:scale-125 transition-transform">✨</div>
                  </div>
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></div>
                </div>
              </div>
            </>
          )
        )}


        {/* ✅ Quick Actions - Enhanced Design */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/ngo/upload-project"
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 block overflow-hidden relative hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">📤</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Upload Project</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Submit your new project for approval.
                </p>
                <div className="mt-4 inline-block text-emerald-600 font-semibold text-sm">
                  Get Started →
                </div>
              </div>
            </Link>


            <Link
              to="/ngo/past-projects"
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 block overflow-hidden relative hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">📂</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Past Projects</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  View your approved and pending projects here.
                </p>
                <div className="mt-4 inline-block text-blue-600 font-semibold text-sm">
                  View All →
                </div>
              </div>
            </Link>


            <button
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 block text-left w-full overflow-hidden relative hover:scale-105"
              onClick={handleSellCCClick}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">💰</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Sell CC</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sell your carbon credits securely.
                </p>
                <div className="mt-4 inline-block text-amber-600 font-semibold text-sm">
                  Sell Now →
                </div>
              </div>
            </button>
          </div>
          <SellCCModal
            open={sellModalOpen}
            onClose={() => setSellModalOpen(false)}
            account={account}
            onSuccess={handleTransferSuccess}
          />
        </div>


        {/* ✅ Recent Activity - Enhanced Timeline Style */}
        {!loading && !error && dashboardData && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {dashboardData.recent_activity &&
                dashboardData.recent_activity.length > 0 ? (
                  dashboardData.recent_activity.map((project, index) => (
                    <div
                      key={project.project_id || index}
                      className="flex items-start gap-4 pb-4 border-b last:border-b-0 hover:bg-gray-50 -mx-8 px-8 py-3 rounded-lg transition"
                    >
                      <div className="text-2xl flex-shrink-0 mt-1">
                        {project.status === "approved" && "✅"}
                        {project.status === "pending" && "⏳"}
                        {project.status === "minted" && "💎"}
                        {project.status === "rejected" && "❌"}
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-800 font-medium text-sm">
                          Project "{project.location} - {project.tree_type}" is{" "}
                          <span className="font-bold text-gray-900 capitalize">{project.status}</span>
                        </p>
                        {project.created_at && (
                          <span className="text-xs text-gray-400 mt-1 block">
                            {new Date(project.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No recent activity found.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ✅ Upcoming Tasks - Enhanced Design */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Tasks</h3>
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl border border-emerald-200 hover:border-emerald-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Upload project photos with geo-tag</span>
              </div>
              <button className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                Mark Done
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-200 hover:border-blue-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Update Seller profile documents</span>
              </div>
              <button className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                Mark Done
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
