import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import buyerApi from "../api/buyer";

export default function BuyerDashboard() {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data function
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await buyerApi.getBuyerDashboard();
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

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Taskbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold drop-shadow-md">Buyer Dashboard</h1>
        <ul className="flex gap-6 text-sm font-semibold">
          <li>
            <Link to="/" className="hover:underline hover:text-emerald-300 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline hover:text-emerald-300 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/buyer/profile" className="hover:underline hover:text-emerald-300 transition">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:underline hover:text-emerald-300 transition">
              Blog
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-grow px-8 py-12 space-y-12 max-w-7xl mx-auto overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : (
          <>
            {/* Welcome */}
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800 drop-shadow">
              Welcome back, <span className="text-green-600">{dashboardData?.profile?.company_name || "Buyer"}</span>
            </h2>

            {/* Wallet + Quick Actions in single responsive row */}
            <section>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 drop-shadow">Overview</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-l-emerald-500 hover:shadow-lg transition transform hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-emerald-700 mb-4">Wallet</h3>
                  <p className="text-5xl font-extrabold">{dashboardData?.stats?.total_credits_owned || 0}</p>
                </div>

                <div
                  role="button"
                  aria-disabled="true"
                  className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-l-blue-500 hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <h4 className="text-xl font-semibold mb-3">💳 Buy CC</h4>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Purchase carbon credits securely from verified projects.
                  </p>
                </div>

                <div
                  role="button"
                  aria-disabled="true"
                  className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-l-amber-500 hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <h4 className="text-xl font-semibold mb-3">📜 Transactions</h4>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    View your complete transaction history here.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        

        {/* Recent Activity (Buyer specific) */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-gray-800 drop-shadow">Recent Activity</h3>
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-h-72 overflow-y-auto">
            <p className="text-gray-700 text-sm leading-relaxed">
              ✅ Purchased 100 CC from <span className="font-semibold">"Coastal Mangrove Project"</span>.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              💰 Bid placed for 75 CC in <span className="font-semibold">"Seagrass Plantation"</span>.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              📜 Invoice generated for transaction <span className="font-semibold">#4521</span>.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              ⚠️ Pending payment confirmation for 50 CC.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              ✅ Wallet topped up with ₹20,000 for future purchases.
            </p>
          </div>
        </section>

        {/* Upcoming Tasks (Buyer specific) */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-gray-800 drop-shadow">Upcoming Tasks</h3>
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-transparent rounded-xl border border-emerald-200 hover:border-emerald-400 transition py-3 px-5">
              <span className="text-gray-700 font-medium">Review project details before purchasing CC</span>
              <button className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition">
                Mark Done
              </button>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-200 hover:border-blue-400 transition py-3 px-5">
              <span className="text-gray-700 font-medium">Upload KYC documents for verification</span>
              <button className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition">
                Mark Done
              </button>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-transparent rounded-xl border border-amber-200 hover:border-amber-400 transition py-3 px-5">
              <span className="text-gray-700 font-medium">Set auto-payment method for faster CC purchases</span>
              <button className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition">
                Mark Done
              </button>
            </div>
          </div>
        </section>

        {/* Wallet Connection removed per simplification */}
      </main>
    </div>
  );
}
