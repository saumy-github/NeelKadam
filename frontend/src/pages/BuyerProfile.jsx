import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useWalletConnect from "../hooks/useWalletConnect";
import buyerApi from "../api/buyer";

export default function BuyerProfile() {
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
    // Clear auth tokens
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    alert("Signed out successfully!");
    navigate("/login/buyer");
  };

  // Effect for fetching profile data - runs only once on component mount
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const response = await buyerApi.getBuyerDashboard();
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
  }, []); // Empty dependency array - runs only once

  // Separate effect for blockchain wallet data
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    let connectionTimeout;

    async function fetchBlockchainData() {
      try {
        // Set a timeout to prevent indefinite loading
        connectionTimeout = setTimeout(() => {
          if (isMounted && txLoading) {
            console.log("Blockchain transaction fetch timed out");
            setTxLoading(false);
            setTxError(
              "Connection timed out. Please make sure MetaMask is installed and connected."
            );

            // Use API transaction data as fallback if available
            if (profileData && profileData.transactions) {
              setTransactions(profileData.transactions);
            }
          }
        }, 10000); // 10 second timeout

        // Try to connect wallet
        await connectWallet();

        if (!isMounted) return; // Don't proceed if component unmounted

        if (contract && account) {
          // Fetch wallet balance
          try {
            const balance = await contract.getWalletBalance(account);
            if (isMounted) {
              setWalletBalance(Number(balance));
            }
          } catch (err) {
            console.error("Error fetching wallet balance:", err);
            if (isMounted) {
              setWalletBalance("Error");
            }
          }

          // Fetch all transactions
          if (isMounted) {
            setTxLoading(true);
            setTxError("");
          }

          try {
            const allTx = await contract.getAllTransactions();

            if (isMounted) {
              // Clear timeout since we got a response
              clearTimeout(connectionTimeout);

              // Filter only those where from or to is the current account
              const filtered = allTx.filter(
                (tx) =>
                  (tx.from &&
                    tx.from.toLowerCase() === account.toLowerCase()) ||
                  (tx.to && tx.to.toLowerCase() === account.toLowerCase())
              );
              setTransactions(filtered);
              setTxLoading(false);
            }
          } catch (err) {
            console.error("Error fetching transactions:", err);
            if (isMounted) {
              clearTimeout(connectionTimeout);
              setTxError("Could not fetch blockchain transactions");
              setTxLoading(false);

              // Use API transaction data as fallback if available
              if (profileData && profileData.transactions) {
                setTransactions(profileData.transactions);
              }
            }
          }
        } else {
          // No contract or account available
          if (isMounted) {
            clearTimeout(connectionTimeout);
            setTxLoading(false);
            setTxError("Blockchain wallet not connected");

            // Use API transaction data as fallback if available
            if (profileData && profileData.transactions) {
              setTransactions(profileData.transactions);
            }
          }
        }
      } catch (err) {
        console.error("Blockchain data fetch error:", err);
        if (isMounted) {
          clearTimeout(connectionTimeout);
          setTxLoading(false);
          setTxError("Error connecting to blockchain");

          // Use API transaction data as fallback if available
          if (profileData && profileData.transactions) {
            setTransactions(profileData.transactions);
          }
        }
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
      {/* ✅ Same taskbar as BuyerDashboard */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Buyer Dashboard</h1>
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
            <Link to="/buyer/profile" className="hover:underline">
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
          Buyer Profile
        </h1>

        {/* ✅ Buyer Details */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Buyer Details</h2>

          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-700 mr-2"></div>
              <span>Loading profile data...</span>
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : profileData && profileData.profile ? (
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Company Name:</strong>{" "}
                {profileData.profile.company_name}
              </li>
              <li>
                <strong>Email:</strong> {profileData.profile.email}
              </li>
              <li>
                <strong>PAN No:</strong> {profileData.profile.pan_no}
              </li>
              <li>
                <strong>Account Holder:</strong>{" "}
                {profileData.profile.account_holder_name}
              </li>
              <li>
                <strong>Account Number:</strong>{" "}
                {profileData.profile.account_number
                  ? "•••••" + profileData.profile.account_number.slice(-4)
                  : ""}
              </li>
              <li>
                <strong>IFSC Code:</strong> {profileData.profile.ifsc_code}
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <strong>Wallet Address:</strong>{" "}
                  {profileData.profile.wallet_address ? (
                    <span className="font-mono text-sm">
                      {profileData.profile.wallet_address}
                    </span>
                  ) : account ? (
                    <div className="flex items-center">
                      <span className="font-mono text-sm bg-yellow-50 px-1">
                        {account}
                      </span>
                      <span className="ml-2 text-xs text-yellow-600">
                        (from MetaMask, not saved)
                      </span>
                    </div>
                  ) : (
                    <span className="text-red-500">Not connected</span>
                  )}
                </div>

                {!profileData.profile.wallet_address && account && (
                  <button
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md"
                    onClick={async () => {
                      try {
                        const response = await buyerApi.updateWalletAddress(
                          account
                        );
                        if (response.success) {
                          // Update local state to reflect the change
                          setProfileData({
                            ...profileData,
                            profile: {
                              ...profileData.profile,
                              wallet_address: account,
                            },
                          });
                          alert("Wallet address saved successfully!");
                        } else {
                          alert(
                            "Failed to save wallet address: " +
                              (response.error || "Unknown error")
                          );
                        }
                      } catch (err) {
                        console.error("Error saving wallet address:", err);
                        alert(
                          "Error saving wallet address: " +
                            (err.message || "Unknown error")
                        );
                      }
                    }}
                  >
                    Save to Profile
                  </button>
                )}
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

        {/* ✅ Wallet Info */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blockchain Wallet */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Blockchain Wallet</h2>
              <p className="text-gray-700">
                <strong>Balance:</strong>{" "}
                {walletBalance === null
                  ? "Loading..."
                  : walletBalance === "Error"
                  ? "Error"
                  : `${walletBalance} CC`}
              </p>
            </div>

            {/* System Credits */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Carbon Credits</h2>
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-red-600">Error loading data</div>
              ) : profileData ? (
                <p className="text-gray-700">
                  <strong>Total Credits:</strong>{" "}
                  {profileData.stats.total_credits_owned || 0} CC
                </p>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </section>

        {/* ✅ Transactions */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          {txLoading ? (
            <div>Loading transactions...</div>
          ) : txError ? (
            <div className="text-red-600">{txError}</div>
          ) : transactions.length === 0 ? (
            <div>No transaction found</div>
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

        <div className="flex justify-center mt-10">
          <button
            onClick={handleSignOut}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
