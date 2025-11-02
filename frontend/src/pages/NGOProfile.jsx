import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useWalletConnect from "../hooks/useWalletConnect";
import dashboardApi from "../api/dashboard";

export default function NGOProfile() {
  const navigate = useNavigate();
  const { account, contract, connectWallet } = useWalletConnect();
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState("");

  // State for profile data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSignOut = () => {
    alert("Signed out successfully!");
    navigate("/login/ngo");
  };

  const refreshWalletBalance = async () => {
    try {
      setWalletBalance(null); // Set to loading state
      if (!contract || !account) {
        await connectWallet();
      }
      if (contract && account) {
        const balance = await contract.getWalletBalance(account);
        setWalletBalance(Number(balance));
        console.log("Wallet balance refreshed:", Number(balance));
      } else {
        throw new Error("Cannot connect to wallet or contract");
      }
    } catch (err) {
      console.error("Error refreshing wallet balance:", err);
      setWalletBalance("Error");
      setTimeout(() => {
        if (profileData && profileData.stats) {
          setWalletBalance(profileData.stats.minted_carbon_credits || 0);
        }
      }, 2000);
    }
  };

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const response = await dashboardApi.getNgoDashboard(false);
        if (response.success) {
          setProfileData(response.dashboard);
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
    return () => {};
  }, []);

  useEffect(() => {
    if (profileData && profileData.stats && walletBalance === null) {
      setWalletBalance(profileData.stats.minted_carbon_credits || 0);
    }
  }, [profileData, walletBalance]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Taskbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">NGO Dashboard</h1>
        <ul className="flex gap-6 text-sm font-medium">
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

      {/* Main Content */}
      <main className="flex-grow px-8 py-12 space-y-10 max-w-5xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-8 drop-shadow">
          Seller Profile
        </h1>

        {/* Seller Details */}
        <section className="bg-white rounded-2xl shadow-lg p-10 mb-8 border-l-4 border-emerald-500 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Seller Details</h2>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await dashboardApi.getNgoDashboard(true);
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
            <div className="text-gray-600">Loading profile data...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : profileData && profileData.profile ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-gray-700">
              <li>
                <span className="font-semibold text-gray-800">Name:</span>{" "}
                {profileData.profile.ngo_name}
              </li>
              <li>
                <span className="font-semibold text-gray-800">License No:</span>{" "}
                {profileData.profile.license_no}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {profileData.profile.email}
              </li>
              <li>
                <span className="font-semibold text-gray-800">PAN No:</span>{" "}
                {profileData.profile.pan_no}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Spokesperson:</span>{" "}
                {profileData.profile.spokesperson_name}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Member Since:</span>{" "}
                {new Date(profileData.profile.created_at).toLocaleDateString()}
              </li>
            </ul>
          ) : (
            <div className="text-gray-600">No profile data available</div>
          )}
        </section>

        {/* Wallet/Stats */}
  <section className="bg-white rounded-2xl shadow-lg p-10 mb-8 flex flex-col items-center gap-10 border-l-4 border-blue-500 animate-fade-in">
          {/* Wallet column removed - stats boxes will be centered below */}
          
          {/* Project Statistics */}
<div>
  <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center w-full">Project Statistics</h2>
  {loading ? (
    <div className="text-center text-gray-600 py-12">Loading stats...</div>
  ) : error ? (
    <div className="text-center text-red-600 py-12 bg-red-50 rounded-lg">{error}</div>
  ) : profileData && profileData.stats ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Total Projects Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
        <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">Total Projects</span>
        <span className="text-5xl font-extrabold text-emerald-600">{profileData.stats.total_projects}</span>
        <div className="mt-3 w-12 h-1 bg-emerald-500 rounded-full" />
      </div>

      {/* Pending Projects Card */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
        <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-3">Pending Projects</span>
        <span className="text-5xl font-extrabold text-amber-600">{profileData.stats.pending_projects}</span>
        <div className="mt-3 w-12 h-1 bg-amber-500 rounded-full" />
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
        <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">Wallet Balance</span>
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="text-5xl font-extrabold text-blue-600">
            {walletBalance === null ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : walletBalance === "Error" ? (
              <span className="text-lg text-amber-600">Unavailable</span>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>{walletBalance}</span>
                <span className="text-lg text-gray-600 font-normal">CC</span>
              </div>
            )}
          </div>

          <button
            onClick={refreshWalletBalance}
            disabled={!account}
            className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 disabled:bg-gray-300 text-blue-700 disabled:text-gray-500 transition-colors shadow"
            title="Refresh wallet balance"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582M20 20v-5h-.581M20.418 9A8.001 8.001 0 004.582 15"
              />
            </svg>
          </button>
        </div>
        <div className="mt-3 w-12 h-1 bg-blue-500 rounded-full" />
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-600 py-12 bg-gray-50 rounded-lg">No stats available</div>
  )}
</div>

  </section>

  {/* Recent Projects Activity */}
        <section className="bg-white rounded-2xl shadow-lg p-10 mb-8 border-l-4 border-yellow-500 animate-fade-in">
          <h2 className="text-2xl font-bold text-yellow-700 mb-6">
            Recent Project Activity
          </h2>
          {loading ? (
            <div className="text-gray-600">Loading recent activity...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : profileData &&
            profileData.recent_activity &&
            profileData.recent_activity.length > 0 ? (
            <div className="space-y-6">
              {profileData.recent_activity.map((project) => (
                <div
                  key={project.project_id}
                  className={`p-5 rounded-xl border shadow flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r ${
                    project.status === "approved"
                      ? "from-green-50"
                      : project.status === "pending"
                      ? "from-yellow-50"
                      : project.status === "minted"
                      ? "from-blue-50"
                      : project.status === "rejected"
                      ? "from-red-50"
                      : "from-gray-50"
                  } to-white`}
                >
                  <div>
                    <div className="font-bold">
                      {project.project_id} — <span className="capitalize">{project.status}</span>
                    </div>
                    <div className="mt-1 text-gray-700">
                      <span className="font-medium">Location:</span> {project.location} |{" "}
                      <span className="font-medium">Type:</span> {project.tree_type} |{" "}
                      <span className="font-medium">CC:</span> {project.estimated_cc}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 mt-3 md:mt-0 rounded-xl font-semibold text-sm text-white shadow ${
                      project.status === "approved"
                        ? "bg-emerald-600"
                        : project.status === "pending"
                        ? "bg-yellow-500"
                        : project.status === "minted"
                        ? "bg-blue-600"
                        : project.status === "rejected"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {project.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">No recent activity available</div>
          )}
        </section>

        {/* Transactions */}
        <section className="bg-white rounded-2xl shadow-lg p-10 mb-8 border-l-4 border-blue-400 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700">Transaction History</h2>
            <button
              onClick={async () => {
                try {
                  setTxLoading(true);
                  setTxError("");
                  await connectWallet();

                  if (contract && account) {
                    try {
                      const allTx = await contract.getAllTransactions();
                      const filtered = allTx.filter(
                        (tx) =>
                          (tx.from &&
                            tx.from.toLowerCase() === account.toLowerCase()) ||
                          (tx.to &&
                            tx.to.toLowerCase() === account.toLowerCase())
                      );
                      setTransactions(filtered);
                    } catch (err) {
                      setTxError("Could not fetch transactions");
                    }
                  } else {
                    setTxError("Wallet connection required");
                  }
                } catch (err) {
                  setTxError("Failed to connect to blockchain");
                  console.error(err);
                } finally {
                  setTxLoading(false);
                }
              }}
              className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center shadow"
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

          {txLoading ? (
            <div className="flex items-center justify-center py-10">
              <svg
                className="animate-spin -ml-1 mr-3 h-8 w-8 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-lg text-green-700 font-semibold">Loading transactions...</span>
            </div>
          ) : txError ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-700">{txError}</p>
              <p className="text-sm text-gray-600 mt-2">
                Transactions require an active blockchain connection. Please
                make sure MetaMask is installed and connected.
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="font-semibold">No transactions found</p>
              <p className="text-sm mt-2">
                When you sell carbon credits, your transactions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, idx) => (
                <div
                  key={tx.id ? tx.id.toString() : idx}
                  className="flex flex-col md:flex-row md:justify-between py-4 px-5 border rounded-xl bg-gradient-to-r from-blue-50 to-white shadow"
                >
                  <span>
                    <span className="font-semibold">Type:</span> {tx.txType} |{" "}
                    <span className="font-semibold">Credit ID:</span> {tx.creditId?.toString?.() || "-"}{" "}
                    <br />
                    <span className="font-semibold">From:</span> {tx.from} <br />
                    <span className="font-semibold">To:</span> {tx.to} <br />
                    <span className="font-semibold">Timestamp:</span>{" "}
                    {tx.timestamp
                      ? new Date(Number(tx.timestamp) * 1000).toLocaleString()
                      : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sign Out */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              sessionStorage.clear();
              alert("Signed out successfully!");
              window.location.href = "/";
            }}
            className="px-8 py-3 bg-red-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-red-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
