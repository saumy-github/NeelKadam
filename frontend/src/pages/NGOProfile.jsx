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

  // Effect for fetching profile data - runs only once on component mount
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        // Use cached data if available (forceRefresh=false)
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

    // Cleanup function to prevent memory leaks
    return () => {
      // No cleanup needed for API calls with our cache implementation
    };
  }, []); // Empty dependency array - runs only once

  // Separate effect for blockchain wallet data
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    let connectionTimeout;

    async function fetchBlockchainData() {
      try {
        // Set a timeout to provide fallback data if connection takes too long
        connectionTimeout = setTimeout(() => {
          if (walletBalance === null && isMounted) {
            console.log("Using fallback wallet data due to timeout");
            // Use mock data from profileData if available
            if (profileData && profileData.stats) {
              setWalletBalance(profileData.stats.minted_carbon_credits || 0);
            } else {
              setWalletBalance(0);
            }
          }
        }, 5000); // 5 second timeout

        // Fetch blockchain wallet data
        await connectWallet();

        if (!isMounted) return; // Don't proceed if component unmounted

        if (contract && account) {
          // Fetch wallet balance
          try {
            const balance = await contract.getWalletBalance(account);
            if (isMounted) {
              clearTimeout(connectionTimeout);
              setWalletBalance(Number(balance));
            }
          } catch (err) {
            console.error("Wallet balance error:", err);
            if (isMounted) {
              clearTimeout(connectionTimeout);
              // Use mock data from profileData if available after error
              if (profileData && profileData.stats) {
                setWalletBalance(profileData.stats.minted_carbon_credits || 0);
              } else {
                setWalletBalance(0);
              }
            }
          }

          // Fetch all transactions
          if (isMounted) setTxLoading(true);
          if (isMounted) setTxError("");

          try {
            const allTx = await contract.getAllTransactions();
            // Filter only those where from or to is the current account
            if (isMounted) {
              const filtered = allTx.filter(
                (tx) =>
                  (tx.from &&
                    tx.from.toLowerCase() === account.toLowerCase()) ||
                  (tx.to && tx.to.toLowerCase() === account.toLowerCase())
              );
              setTransactions(filtered);
            }
          } catch (err) {
            if (isMounted) setTxError("Could not fetch transactions");
          }

          if (isMounted) setTxLoading(false);
        }
      } catch (err) {
        console.error("Error fetching blockchain data:", err);
      }
    }

    fetchBlockchainData();

    // Cleanup function
    return () => {
      isMounted = false;
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [account, contract, profileData]);
  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3]">
      {/* ✅ Same taskbar as Dashboard */}
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

      {/* ✅ Main content area */}
      <main className="flex-grow p-8 space-y-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Seller Profile
        </h1>

        {/* ✅ NGO Details */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Seller Details</h2>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  // Force refresh data
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
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Name:</strong> {profileData.profile.ngo_name}
              </li>
              <li>
                <strong>License No:</strong> {profileData.profile.license_no}
              </li>
              <li>
                <strong>Email:</strong> {profileData.profile.email}
              </li>
              <li>
                <strong>PAN No:</strong> {profileData.profile.pan_no}
              </li>
              <li>
                <strong>Spokesperson:</strong>{" "}
                {profileData.profile.spokesperson_name}
              </li>
              <li>
                <strong>Member Since:</strong>{" "}
                {new Date(profileData.profile.created_at).toLocaleDateString()}
              </li>
            </ul>
          ) : (
            <div className="text-gray-600">No profile data available</div>
          )}
        </section>

        {/* ✅ Wallet Info and Project Stats */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet Information */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Wallet</h2>
                {walletBalance !== null && walletBalance !== "Error" && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Using {profileData ? "blockchain" : "estimated"} data
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-lg">
                <strong>Balance:</strong>{" "}
                {walletBalance === null ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600"
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
                    Loading wallet...
                  </span>
                ) : walletBalance === "Error" ? (
                  <span className="text-yellow-600">Unavailable</span>
                ) : (
                  <span className="font-bold text-green-700">
                    {walletBalance} CC
                  </span>
                )}
              </p>
            </div>

            {/* Project Statistics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Project Statistics</h2>
              {loading ? (
                <div className="text-gray-600">Loading stats...</div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : profileData && profileData.stats ? (
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Total Projects:</strong>{" "}
                    {profileData.stats.total_projects}
                  </li>
                  <li>
                    <strong>Pending Projects:</strong>{" "}
                    {profileData.stats.pending_projects}
                  </li>
                  <li>
                    <strong>Minted Carbon Credits:</strong>{" "}
                    {profileData.stats.minted_carbon_credits}
                  </li>
                </ul>
              ) : (
                <div className="text-gray-600">No stats available</div>
              )}
            </div>
          </div>
        </section>

        {/* ✅ Recent Projects Activity */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Recent Project Activity
          </h2>
          {loading ? (
            <div className="text-gray-600">Loading recent activity...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : profileData &&
            profileData.recent_activity &&
            profileData.recent_activity.length > 0 ? (
            <div className="space-y-4">
              {profileData.recent_activity.map((project) => (
                <div
                  key={project.project_id}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Project ID: {project.project_id}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        project.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : project.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : project.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : project.status === "minted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p>
                      <strong>Location:</strong> {project.location}
                    </p>
                    <p>
                      <strong>Tree Type:</strong> {project.tree_type}
                    </p>
                    <p>
                      <strong>Estimated Carbon Credits:</strong>{" "}
                      {project.estimated_cc}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created on{" "}
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">No recent activity available</div>
          )}
        </section>

        {/* ✅ Transactions */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <button
              onClick={async () => {
                try {
                  setTxLoading(true);
                  setTxError("");
                  // Force reconnect to blockchain
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
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
            <div className="flex items-center justify-center py-8">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600"
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
              <span>Loading transactions...</span>
            </div>
          ) : txError ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
              <p className="text-yellow-700">{txError}</p>
              <p className="text-sm text-gray-600 mt-2">
                Transactions require an active blockchain connection. Please
                make sure MetaMask is installed and connected.
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
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
              <p>No transactions found</p>
              <p className="text-sm mt-2">
                When you sell carbon credits, your transactions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, idx) => (
                <div
                  key={tx.id ? tx.id.toString() : idx}
                  className="flex flex-col md:flex-row md:justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <span>
                    <strong>Type:</strong> {tx.txType} |{" "}
                    <strong>Credit ID:</strong>{" "}
                    {tx.creditId?.toString?.() || "-"} <br />
                    <strong>From:</strong> {tx.from} <br />
                    <strong>To:</strong> {tx.to} <br />
                    <strong>Timestamp:</strong>{" "}
                    {tx.timestamp
                      ? new Date(Number(tx.timestamp) * 1000).toLocaleString()
                      : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ✅ Sign Out */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              // Clear all local storage including auth tokens
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              sessionStorage.clear();

              // Navigate to home page
              alert("Signed out successfully!");
              window.location.href = "/";
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
