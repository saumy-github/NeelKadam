// Blockchain utility for interacting with the smart contract
import { ethers } from "ethers";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const contractABI = require("../../blockchain/abi.json");

// Contract configuration
const CONTRACT_ADDRESS = "0xacea7fa9e319ca2f1cadce88dd023887d017f741"; // Same as frontend
const PROVIDER_URL =
  process.env.PROVIDER_URL ||
  "https://sepolia.infura.io/v3/your-infura-project-id"; // Replace with your Infura project ID
const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || ""; // Admin private key for minting (will be set in .env)

// Initialize provider
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

// Helper to create contract with wallet when needed (lazy init)
function getContractWithWallet() {
  if (!PRIVATE_KEY) {
    throw new Error("ADMIN_PRIVATE_KEY not set in environment");
  }
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
}

/**
 * Mint carbon credits for an NGO
 * @param {string} ngoWalletAddress - The wallet address of the NGO
 * @param {number} amount - The amount of carbon credits to mint
 * @returns {Promise<{success: boolean, txHash: string, error: string}>} - Transaction result
 */
async function mintCarbonCredits(ngoWalletAddress, amount) {
  try {
    console.log(
      `Minting ${amount} carbon credits for NGO wallet: ${ngoWalletAddress}`
    );

    // Validate inputs
    if (!ngoWalletAddress || !ethers.isAddress(ngoWalletAddress)) {
      throw new Error("Invalid NGO wallet address");
    }

    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      throw new Error("Amount must be a positive integer");
    }

    // Call the contract method to generate/mint credits
    // Assumes contract has a function named `generateCredits(address,uint256)`
    // and that the signer (wallet) has the required role.
    console.log("Sending transaction to contract.generateCredits...");
    const contract = getContractWithWallet();
    const tx = await contract.generateCredits(ngoWalletAddress, amount);
    console.log("Transaction sent, tx.hash:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined. blockNumber:", receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
      error: null,
      receipt,
    };
  } catch (error) {
    console.error("Error minting carbon credits:", error.message || error);
    return {
      success: false,
      txHash: null,
      error: error.message || String(error),
    };
  }
}

export { mintCarbonCredits };
