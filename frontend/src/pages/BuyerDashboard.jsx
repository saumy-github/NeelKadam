import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useWalletConnect from "../hooks/useWalletConnect";

export default function BuyerDashboard() {
  const { account, connectWallet } = useWalletConnect();

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3]">
      {/* ✅ Taskbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Buyer Dashboard</h1>
        <ul className="flex gap-6 text-sm font-medium">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/buyer/profile" className="hover:underline">Profile</Link></li>
          <li><Link to="/blog" className="hover:underline">Blog</Link></li>
        </ul>
      </nav>

      {/* ✅ Main content area */}
      <main className="flex-grow p-8 space-y-10 overflow-y-auto">
        {/* Welcome */}
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>

        {/* ✅ Wallet & Transaction Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">Wallet Balance</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">500 CC</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">Transactions</h3>
            <p className="text-3xl font-bold mt-2">24</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-green-700">Verified Purchases</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">12</p>
          </div>
        </div>

        {/* ✅ Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Buy Carbon Credits */}
            <Link
              to="/buyer/buy-cc"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">💳 Buy CC</h4>
              <p className="text-gray-600">Purchase carbon credits securely from verified projects.</p>
            </Link>

            {/* Sell Carbon Credits */}
            <Link
              to="/buyer/sell-cc"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">💰 Sell CC</h4>
              <p className="text-gray-600">List and sell your carbon credits in the market.</p>
            </Link>

            {/* Transaction History */}
            <Link
              to="/buyer/transactions"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h4 className="text-lg font-semibold mb-2">📜 Transactions</h4>
              <p className="text-gray-600">View your complete transaction history here.</p>
            </Link>
          </div>
        </div>

        {/* ✅ Recent Activity (Buyer-specific) */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="bg-white p-6 rounded-xl shadow space-y-4 max-h-64 overflow-y-auto">
            <p className="text-sm text-gray-700">✅ Purchased 100 CC from "Coastal Mangrove Project".</p>
            <p className="text-sm text-gray-700">💰 Bid placed for 75 CC in "Seagrass Plantation".</p>
            <p className="text-sm text-gray-700">📜 Invoice generated for transaction #4521.</p>
            <p className="text-sm text-gray-700">⚠️ Pending payment confirmation for 50 CC.</p>
            <p className="text-sm text-gray-700">✅ Wallet topped up with ₹20,000 for future purchases.</p>
          </div>
        </div>

        {/* ✅ Upcoming Tasks (Buyer-specific) */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Tasks</h3>
          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <div className="flex items-center justify-between">
              <span>Review project details before purchasing CC</span>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Done
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Upload KYC documents for verification</span>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Done
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Set auto-payment method for faster CC purchases</span>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Done
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Connection Status */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Wallet Connection</h3>
          {account ? (
            <p className="text-green-600">Connected wallet: {account}</p>
          ) : (
            <p className="text-red-600">Connecting to MetaMask...</p>
          )}
        </div>
      </main>
    </div>
  );
}
