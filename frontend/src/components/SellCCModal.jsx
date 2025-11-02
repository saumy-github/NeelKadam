import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../abi.json";
import { transferCarbonCredits } from "../api/transfer";
import apiClient from "../api/config";
import {
  connectMetaMask,
  verifyMetaMaskAddress,
  isMetaMaskInstalled,
} from "../utils/metamask";
import { useAuth } from "../contexts/AuthContext";

const CONTRACT_ADDRESS = "0x365738edE45674DEAB1B2C665E66B82c80Ebe4E6"; // Replace with your deployed contract address

export default function SellCCModal({ open, onClose, account, onSuccess }) {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Check wallet connection when modal opens
  useEffect(() => {
    if (open) {
      checkWalletConnection();
    }
  }, [open, user]);

  const checkWalletConnection = async () => {
    if (!user?.wallet_address) {
      setError("No wallet address found in your profile.");
      return;
    }

    if (!isMetaMaskInstalled()) {
      setWalletConnected(false);
      setError("MetaMask is not installed.");
      return;
    }

    // Check if MetaMask is already connected and matches
    const verification = await verifyMetaMaskAddress(user.wallet_address);

    if (verification.isValid) {
      setWalletConnected(true);
      setConnectedAddress(verification.currentAddress);
      setError("");
    } else {
      setWalletConnected(false);
      setConnectedAddress("");
    }
  };

  const handleConnectWallet = async () => {
    setError("");
    setIsConnecting(true);

    try {
      if (!isMetaMaskInstalled()) {
        throw new Error("Please install MetaMask extension first.");
      }

      if (!user?.wallet_address) {
        throw new Error("No wallet address found in your profile.");
      }

      // Connect to MetaMask
      const address = await connectMetaMask();

      // Verify the connected address matches the registered one
      const verification = await verifyMetaMaskAddress(user.wallet_address);

      if (verification.isValid) {
        setWalletConnected(true);
        setConnectedAddress(address);
        setError("");
      } else {
        setWalletConnected(false);
        setError(verification.message);
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Failed to connect MetaMask");
      setWalletConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSell = async () => {
    setLoading(true);
    setError("");
    setTxHash(null);
    setSuccessMessage("");

    try {
      // Step 1: Validate wallet connection
      if (!walletConnected) {
        throw new Error("Please connect your MetaMask wallet first.");
      }

      // Step 2: Validate inputs

      if (!recipient || recipient.trim() === "") {
        throw new Error("Please enter a valid company name.");
      }
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new Error("Please enter a valid amount.");
      }

      // Re-verify wallet before transaction
      const verification = await verifyMetaMaskAddress(user.wallet_address);
      if (!verification.isValid) {
        setWalletConnected(false);
        throw new Error(verification.message);
      }

      console.log("🔵 Step 1: Starting blockchain transaction...");

      // Step 3: Execute blockchain transaction
      // Note: Backend will lookup buyer wallet address from company name
      // For now, we'll do backend call first to validate and get wallet, then blockchain
      let buyerWalletAddress;

      console.log("🔵 Validating buyer company name with backend...");
      try {
        // Make a preliminary call to validate buyer exists and get wallet address
        const tempResponse = await apiClient.get(
          `/api/buyer/lookup/${encodeURIComponent(recipient)}`
        );
        buyerWalletAddress = tempResponse.data?.wallet_address;

        if (!buyerWalletAddress || !ethers.isAddress(buyerWalletAddress)) {
          throw new Error("Invalid buyer wallet address returned from server");
        }
        console.log(
          "✅ Buyer validated, proceeding with blockchain transaction"
        );
      } catch (lookupError) {
        console.error("❌ Buyer lookup failed:", lookupError);
        throw new Error(
          lookupError.response?.data?.error ||
            lookupError.message ||
            "Failed to validate buyer company name"
        );
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      // Call transferCredits(buyerWalletAddress, amount)
      const tx = await contract.transferCredits(buyerWalletAddress, amount);
      console.log("⏳ Waiting for blockchain confirmation...");
      await tx.wait();
      setTxHash(tx.hash);
      console.log("✅ Blockchain transaction successful! Hash:", tx.hash);

      // Step 4: Update backend database
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

      // Step 5: Success - trigger refresh immediately
      if (onSuccess) {
        console.log("🔄 Triggering dashboard refresh...");
        // Small delay to ensure DB transaction is committed
        setTimeout(() => onSuccess(), 500);
      }

      // Step 6: Show success message, then close modal
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

  // Reset form when modal closes
  const handleClose = () => {
    setRecipient("");
    setAmount("");
    setError("");
    setSuccessMessage("");
    setTxHash(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Sell Carbon Credits</h2>

        {/* Wallet Connection Section */}
        <div
          className={`mb-4 p-4 rounded-lg border ${
            walletConnected
              ? "bg-green-50 border-green-300"
              : "bg-orange-50 border-orange-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">Wallet Status</span>
            {walletConnected ? (
              <span className="text-green-600 font-bold text-sm">
                ✓ Connected
              </span>
            ) : (
              <span className="text-orange-600 font-bold text-sm">
                ⚠ Not Connected
              </span>
            )}
          </div>

          {user?.wallet_address && (
            <p className="text-xs text-gray-600 mb-2">
              <strong>Your Wallet:</strong>
              <br />
              <span className="font-mono">
                {user.wallet_address.substring(0, 10)}...
                {user.wallet_address.substring(user.wallet_address.length - 8)}
              </span>
            </p>
          )}

          {connectedAddress && walletConnected && (
            <p className="text-xs text-green-700 mb-2">
              <strong>Connected:</strong>
              <br />
              <span className="font-mono">
                {connectedAddress.substring(0, 10)}...
                {connectedAddress.substring(connectedAddress.length - 8)}
              </span>
            </p>
          )}

          {!walletConnected && (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              {isConnecting ? "Connecting..." : "🦊 Connect MetaMask"}
            </button>
          )}
        </div>

        <label className="block mb-2 font-semibold">Buyer Company Name</label>
        <input
          type="text"
          placeholder="Enter exact company name"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={!walletConnected}
        />
        <label className="block mb-2 font-semibold">Amount to Send</label>
        <input
          type="number"
          min="1"
          placeholder="Enter amount to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={!walletConnected}
        />
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        {successMessage && (
          <div className="text-green-600 mb-2 font-semibold text-sm">
            {successMessage}
          </div>
        )}
        {txHash && (
          <div className="text-green-600 mb-2 text-sm">
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
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSell}
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !walletConnected}
          >
            {loading ? "Processing..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
