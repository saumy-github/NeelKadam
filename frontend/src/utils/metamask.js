import { ethers } from "ethers";

/**
 * Check if MetaMask is installed
 * @returns {boolean}
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
};

/**
 * Connect to MetaMask and return the wallet address
 * @returns {Promise<string>} - Wallet address
 * @throws {Error} - If MetaMask is not installed or user rejects
 */
export const connectMetaMask = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("Please install MetaMask first and create a wallet.");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Get the provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return address;
  } catch (error) {
    console.error("MetaMask connection error:", error);
    throw new Error(error.message || "Failed to connect to MetaMask");
  }
};

/**
 * Get current connected MetaMask address without requesting connection
 * @returns {Promise<string|null>} - Wallet address or null if not connected
 */
export const getCurrentMetaMaskAddress = async () => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    
    if (accounts.length > 0) {
      return accounts[0].address;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting MetaMask address:", error);
    return null;
  }
};

/**
 * Verify if the current MetaMask address matches the expected address
 * @param {string} expectedAddress - The wallet address to verify against
 * @returns {Promise<{isValid: boolean, currentAddress: string|null, message: string}>}
 */
export const verifyMetaMaskAddress = async (expectedAddress) => {
  if (!isMetaMaskInstalled()) {
    return {
      isValid: false,
      currentAddress: null,
      message: "MetaMask is not installed. Please install MetaMask to continue."
    };
  }

  try {
    const currentAddress = await getCurrentMetaMaskAddress();
    
    if (!currentAddress) {
      return {
        isValid: false,
        currentAddress: null,
        message: "Please connect your MetaMask wallet first."
      };
    }

    // Compare addresses (case-insensitive)
    const isValid = currentAddress.toLowerCase() === expectedAddress.toLowerCase();
    
    if (!isValid) {
      return {
        isValid: false,
        currentAddress,
        message: `MetaMask address mismatch. Please switch to the wallet address you registered with: ${expectedAddress}`
      };
    }

    return {
      isValid: true,
      currentAddress,
      message: "MetaMask address verified successfully."
    };
  } catch (error) {
    console.error("Error verifying MetaMask address:", error);
    return {
      isValid: false,
      currentAddress: null,
      message: "Failed to verify MetaMask address. Please try again."
    };
  }
};

/**
 * Request MetaMask to switch to a specific account
 * @param {string} address - The address to switch to
 */
export const requestAccountSwitch = async (address) => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }]
    });
  } catch (error) {
    console.error("Error requesting account switch:", error);
    throw error;
  }
};
