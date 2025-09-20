import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useWalletConnect from "../hooks/useWalletConnect";

export default function NGOProfile() {
  const navigate = useNavigate();
  const { account, contract, connectWallet } = useWalletConnect();
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState("");

  const handleSignOut = () => {
    alert("Signed out successfully!");
    navigate("/login/ngo");
  };

  // ✅ Demo NGO data (later replace with backend data)
  const ngoDetails = {
    ngo_name: "Mangrove Foundation",
    license_no: "LIC123456",
    email: "ngo@example.com",
    phone: "+91-9876543210",
    spokesperson_name: "Ravi Kumar",
    spokesperson_mobile: "+91-9876543210",
    pan_no: "ABCDE1234F",
    bank: {
      account_holder_name: "Mangrove Foundation",
      account_number: "1234567890",
      ifsc_code: "SBIN0001234",
      micr: "110002345",
    },
  };

  const wallet = {
    total_cc: 500,
  };

  useEffect(() => {
    async function fetchData() {
      await connectWallet();
      if (contract && account) {
        // Fetch wallet balance
        try {
          const balance = await contract.getWalletBalance(account);
          setWalletBalance(Number(balance));
        } catch (err) {
          setWalletBalance("Error");
        }
        // Fetch all transactions
        setTxLoading(true);
        setTxError("");
        try {
          const allTx = await contract.getAllTransactions();
          // Filter only those where from or to is the current account
          const filtered = allTx.filter(
            (tx) =>
              (tx.from && tx.from.toLowerCase() === account.toLowerCase()) ||
              (tx.to && tx.to.toLowerCase() === account.toLowerCase())
          );
          setTransactions(filtered);
        } catch (err) {
          setTxError("Could not fetch transactions");
        }
        setTxLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [account, contract]);

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
        <h1 className="text-3xl font-bold text-green-700 mb-6">Seller Profile</h1>

        {/* ✅ NGO Details */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Seller Details</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Name:</strong> {ngoDetails.ngo_name}
            </li>
            <li>
              <strong>License No:</strong> {ngoDetails.license_no}
            </li>
            <li>
              <strong>Email:</strong> {ngoDetails.email}
            </li>
            <li>
              <strong>Phone:</strong> {ngoDetails.phone}
            </li>
            <li>
              <strong>Spokesperson:</strong> {ngoDetails.spokesperson_name}
            </li>
            
          </ul>
        </section>

        {/* ✅ Wallet Info */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet</h2>
          <p className="text-gray-700">
            <strong>Balance:</strong> {walletBalance === null ? "Loading..." : walletBalance === "Error" ? "Error" : `${walletBalance} CC`}
          </p>
          
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
                    <strong>Type:</strong> {tx.txType} | <strong>Credit ID:</strong> {tx.creditId?.toString?.() || "-"} <br/>
                    <strong>From:</strong> {tx.from} <br/>
                    <strong>To:</strong> {tx.to} <br/>
                    <strong>Timestamp:</strong> {tx.timestamp ? new Date(Number(tx.timestamp) * 1000).toLocaleString() : "-"}
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
