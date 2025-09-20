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
  useEffect(() => {
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
        setError(
          err.message || "An error occurred while fetching dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Clear cache when navigating away from dashboard
    return () => {
      // No cleanup needed
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3]">
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
      <main className="flex-grow p-8 space-y-10 overflow-y-auto">
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
              {/* Welcome */}
              <h2 className="text-2xl font-bold mb-4">
                Welcome back, {dashboardData.profile?.ngo_name || "NGO User"}
              </h2>

              {/* ✅ Project Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-green-700">
                    Total Projects
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {dashboardData.stats?.total_projects || 0}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-green-700">
                    Pending Approval
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-yellow-600">
                    {dashboardData.stats?.pending_projects || 0}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-green-700">
                    Verified CC Earned
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-blue-600">
                    {dashboardData.stats?.minted_carbon_credits || 0}
                  </p>
                </div>
              </div>
            </>
          )
        )}

        {/* ✅ Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/ngo/upload-project"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">📤 Upload Project</h4>
              <p className="text-gray-600">
                Submit your new project for approval.
              </p>
            </Link>

            <Link
              to="/ngo/past-projects"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">📂 Past Projects</h4>
              <p className="text-gray-600">
                View your approved and pending projects here.
              </p>
            </Link>

            <button
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block text-left w-full"
              onClick={handleSellCCClick}
            >
              <h4 className="text-lg font-semibold mb-2">💰 Sell CC</h4>
              <p className="text-gray-600">
                Sell your carbon credits securely.
              </p>
            </button>
          </div>
          <SellCCModal
            open={sellModalOpen}
            onClose={() => setSellModalOpen(false)}
            account={account}
          />
        </div>

        {/* ✅ Recent Activity */}
        {!loading && !error && dashboardData && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="bg-white p-6 rounded-xl shadow space-y-4 max-h-64 overflow-y-auto">
              {dashboardData.recent_activity &&
              dashboardData.recent_activity.length > 0 ? (
                dashboardData.recent_activity.map((project, index) => (
                  <p
                    key={project.project_id || index}
                    className="text-sm text-gray-700"
                  >
                    {project.status === "approved" && "✅ "}
                    {project.status === "pending" && "⚠️ "}
                    {project.status === "minted" && "💰 "}
                    {project.status === "rejected" && "❌ "}
                    Project "{project.location} - {project.tree_type}" is{" "}
                    {project.status}.
                    {project.created_at && (
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-700">
                  No recent activity found.
                </p>
              )}
            </div>
          </div>
        )}

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
              <span>Update Seller profile documents</span>
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
