import { useState } from "react";
import { connectMetaMask, isMetaMaskInstalled } from "../utils/metamask";
import { ADMIN_WALLET_ADDRESS, isAdminWallet } from "../config/admin.config";

/**
 * AdminMetaMaskVerificationModal
 * Modal component that verifies admin's MetaMask wallet before allowing critical actions
 * like project approval
 */
export default function AdminMetaMaskVerificationModal({ 
  isOpen, 
  onClose, 
  onVerified, 
  action = "approve this project"
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [connectedAddress, setConnectedAddress] = useState("");

  const handleVerify = async () => {
    setError("");
    setIsVerifying(true);
    setConnectedAddress("");

    try {
      // Check if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        throw new Error("Please install MetaMask extension to proceed with admin actions.");
      }

      // Connect to MetaMask
      const address = await connectMetaMask();
      setConnectedAddress(address);

      // Verify if the connected address matches the admin wallet
      if (!isAdminWallet(address)) {
        throw new Error(
          `Unauthorized wallet address. Please connect with the official admin wallet:\n${ADMIN_WALLET_ADDRESS}`
        );
      }

      // Verification successful
      onVerified(address);
      onClose();
    } catch (err) {
      console.error("MetaMask verification error:", err);
      setError(err.message || "Failed to verify MetaMask wallet");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Verification Required
          </h2>
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Security Check</strong>
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              To {action}, you must verify your identity by connecting your official admin MetaMask wallet.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Expected Admin Wallet:
            </p>
            <p className="text-xs text-gray-600 font-mono break-all">
              {ADMIN_WALLET_ADDRESS}
            </p>
          </div>

          {connectedAddress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                Connected Wallet:
              </p>
              <p className="text-xs text-blue-600 font-mono break-all">
                {connectedAddress}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "🦊 Connect & Verify MetaMask"
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Make sure you're connected to the correct network and have the admin wallet selected in MetaMask.
          </p>
        </div>
      </div>
    </div>
  );
}
