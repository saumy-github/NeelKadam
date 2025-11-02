import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import buyerApi from "../api/buyer";

export default function BuyerProfile() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    alert("Signed out successfully!");
    navigate("/login/buyer");
  };

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const response = await buyerApi.getBuyerDashboard();
        if (response.success) {
          setProfileData(response.dashboard);
          setTransactions(response.dashboard.transactions || []);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(
          err.message || "An error occurred while fetching profile data"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  // Transactions are sourced from profileData.transactions — no blockchain wallet integration here

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

      {/* Main */}
      <main className="flex-grow px-12 py-12 space-y-14 max-w-7xl mx-auto overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-green-700 mb-10 drop-shadow">
          Buyer Profile
        </h1>

        {/* Buyer Details */}
        <section className="bg-white rounded-2xl shadow-lg p-12 border-l-8 border-emerald-500 mb-12 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">Buyer Details</h2>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await buyerApi.getBuyerDashboard();
                  if (response.success) {
                    setProfileData(response.dashboard);
                    setError(null);
                  } else {
                    setError("Failed to refresh data");
                  }
                } catch (err) {
                  setError("Error refreshing data");
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }}
              className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition flex items-center shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-4 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-green-700"></div>
              Loading profile data...
            </div>
          ) : error ? (
            <div className="text-red-600 font-semibold">{error}</div>
          ) : profileData && profileData.profile ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-gray-800 text-lg">
              <li>
                <span className="font-semibold">Company Name:</span> {profileData.profile.company_name}
              </li>
              <li>
                <span className="font-semibold">Email:</span> {profileData.profile.email}
              </li>
              <li>
                <span className="font-semibold">PAN No:</span> {profileData.profile.pan_no}
              </li>
              <li>
                <span className="font-semibold">Account Holder:</span> {profileData.profile.account_holder_name}
              </li>
              <li>
                <span className="font-semibold">Account Number:</span> {profileData.profile.account_number ? "•••••" + profileData.profile.account_number.slice(-4) : ""}
              </li>
              <li>
                <span className="font-semibold">IFSC Code:</span> {profileData.profile.ifsc_code}
              </li>
              <li>
                <span className="font-semibold">Wallet Address:</span>{" "}
                {profileData.profile.wallet_address ? (
                  <span className="font-mono text-sm">{profileData.profile.wallet_address}</span>
                ) : (
                  <span className="text-red-500 font-semibold">Not provided</span>
                )}
              </li>
              <li>
                <span className="font-semibold">Member Since:</span>{" "}
                {new Date(profileData.profile.created_at).toLocaleDateString()}
              </li>
            </ul>
          ) : (
            <div className="text-gray-600 text-lg">No profile data available</div>
          )}
        </section>

        {/* Blockchain Wallet UI removed — profile shows saved wallet address and transactions only */}

        {/* Wallet (restored) */}
        <section className="bg-white rounded-2xl shadow-lg p-10 mb-10 max-w-[60rem] mx-auto border-l-8 border-blue-600 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 drop-shadow">Wallet</h2>
            {loading ? (
              <div className="text-gray-600 text-lg">Loading...</div>
            ) : error ? (
              <div className="text-red-600 font-semibold text-lg">Error loading data</div>
            ) : profileData ? (
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Wallet Balance:</span>{" "}
                {profileData.stats?.total_credits_owned || 0} CC
              </p>
            ) : (
              <p className="text-gray-600 text-lg">No data available</p>
            )}
          </div>
        </section>

        {/* Transactions */}
        <section className="bg-white rounded-2xl shadow-lg p-12 mb-10 max-w-[60rem] mx-auto border-l-8 border-amber-500 animate-fade-in">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 drop-shadow">Transaction History</h2>
          {loading ? (
            <div className="flex items-center gap-6 text-gray-600">
              <div className="animate-spin rounded-full h-7 w-7 border-t-4 border-b-4 border-green-700"></div>
              Loading transactions...
            </div>
          ) : error ? (
            <div className="text-red-600 font-semibold text-lg">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-gray-600 text-lg">No transaction found</div>
          ) : (
            <div className="space-y-6 text-gray-800">
              {transactions.map((tx, idx) => (
                <div
                  key={tx.id ? tx.id.toString() : idx}
                  className="flex flex-col md:flex-row md:justify-between p-8 border rounded-xl bg-gray-50 shadow-lg"
                >
                  <span className="text-lg">
                    <strong>Type:</strong> {tx.txType} | <strong>Credit ID:</strong> {tx.creditId?.toString?.() || "-"} <br />
                    <strong>From:</strong> {tx.from} <br />
                    <strong>To:</strong> {tx.to} <br />
                    <strong>Timestamp:</strong> {tx.timestamp ? new Date(Number(tx.timestamp) * 1000).toLocaleString() : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sign Out */}
        <div className="flex justify-center mt-16">
          <button
            onClick={handleSignOut}
            className="px-12 py-4 bg-red-600 text-white rounded-3xl text-2xl font-bold shadow-lg hover:bg-red-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
