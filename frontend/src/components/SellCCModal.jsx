import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "../abi.json";
import { transferCarbonCredits } from "../api/transfer";

const CONTRACT_ADDRESS = "0xacea7fa9e319ca2f1cadce88dd023887d017f741"; // Replace with your deployed contract address

export default function SellCCModal({ open, onClose, account, onSuccess }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSell = async () => {
    setLoading(true);
    setError("");
    setTxHash(null);
    setSuccessMessage("");

    try {
      // Step 1: Validate inputs
      if (!window.ethereum) throw new Error("MetaMask not found");

      if (!recipient || !ethers.isAddress(recipient)) {
        throw new Error("Please enter a valid recipient address.");
      }
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new Error("Please enter a valid amount.");
      }

      console.log("🔵 Step 1: Starting blockchain transaction...");

      // Step 2: Execute blockchain transaction
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Call transferCredits(recipient, amount)
      const tx = await contract.transferCredits(recipient, amount);
      console.log("⏳ Waiting for blockchain confirmation...");
      await tx.wait();
      setTxHash(tx.hash);
      console.log("✅ Blockchain transaction successful! Hash:", tx.hash);

      // Step 3: Update backend database
      console.log("🔵 Step 2: Updating backend database...");
      try {
        const backendResponse = await transferCarbonCredits(
          recipient,
          amount,
          tx.hash
        );
        console.log("✅ Backend database updated successfully!");
        setSuccessMessage("Transaction successful! Database updated.");
      } catch (backendError) {
        console.error("❌ Backend update failed:", backendError);
        setError(
          `Blockchain transaction succeeded but database update failed: ${
            backendError.response?.data?.error || backendError.message
          }`
        );
        return;
      }

      // Step 4: Success - trigger refresh immediately
      if (onSuccess) {
        console.log("🔄 Triggering dashboard refresh...");
        // Small delay to ensure DB transaction is committed
        setTimeout(() => onSuccess(), 500);
      }

      // Step 5: Show success message, then close modal
      setTimeout(() => {
        onClose();
        // Reset form
        setRecipient("");
        setAmount("");
        setTxHash(null);
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error("❌ Transaction error:", err);
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
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <label className="block mb-2 font-semibold">Amount to Send</label>
        <input
          type="number"
          min="1"
          placeholder="Enter amount to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {successMessage && (
          <div className="text-green-600 mb-2 font-semibold">
            {successMessage}
          </div>
        )}
        {txHash && (
          <div className="text-green-600 mb-2">
            Blockchain transaction:{" "}
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on Etherscan
            </a>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
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
