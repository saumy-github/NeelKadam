import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "../abi.json";

const CONTRACT_ADDRESS = "0xacea7fa9e319ca2f1cadce88dd023887d017f741"; // Replace with your deployed contract address

export default function SellCCModal({ open, onClose, account }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState("");

  const handleSell = async () => {
    setLoading(true);
    setError("");
    setTxHash(null);
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      if (!recipient || !ethers.isAddress(recipient)) {
        throw new Error("Please enter a valid recipient address.");
      }
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new Error("Please enter a valid amount.");
      }
      // Call transferCredits(recipient, amount)
      const tx = await contract.transferCredits(recipient, amount);
      await tx.wait();
      setTxHash(tx.hash);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sell Carbon Credits</h2>
        <label className="block mb-2 font-semibold">Recipient Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <label className="block mb-2 font-semibold">Amount to Send</label>
        <input
          type="number"
          min="1"
          placeholder="Enter amount to send"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {txHash && (
          <div className="text-green-600 mb-2">
            Transaction sent! <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">View on Etherscan</a>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button
            onClick={handleSell}
            className="px-4 py-2 bg-purple-700 text-white rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}