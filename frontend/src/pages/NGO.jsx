import React, { useState, useEffect } from "react";
import SellCCModal from "../components/SellCCModal";
import useWalletConnect from "../hooks/useWalletConnect";

export default function NGO() {
  const [modalOpen, setModalOpen] = useState(false);
  const { account, connectWallet } = useWalletConnect();

  useEffect(() => {
    if (!account) {
      connectWallet();
    }
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  const handleSellClick = async () => {
    if (!account) await connectWallet();
    setModalOpen(true);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-800 mb-6">🌱 NGO Dashboard</h1>
      <button className="bg-green-600 px-4 py-2 rounded-lg text-white mb-4 hover:bg-green-500">
        Upload Project Data
      </button>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">My Projects</h2>
        <p className="text-gray-600 mt-2">No projects uploaded yet.</p>
      </div>
      <button
        className="p-4 bg-white rounded-xl shadow text-lg font-bold flex items-center gap-2 mb-4"
        onClick={handleSellClick}
      >
        <span role="img" aria-label="money bag">💰</span> Sell CC
      </button>
      <SellCCModal open={modalOpen} onClose={() => setModalOpen(false)} account={account} />
    </div>
  );
}
