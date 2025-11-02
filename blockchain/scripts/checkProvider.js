import { ethers } from "ethers";
import { PROVIDER_URL, CONTRACT_ADDRESS } from "./config.js";

async function main() {
  // Use either env var or command line arg
  let providerUrl = process.argv[2] || process.env.PROVIDER_URL;

  if (!providerUrl) {
    console.error(
      "No provider URL found. Please set PROVIDER_URL in .env or pass as argument."
    );
    process.exit(1);
  }

  console.log("Testing provider URL:", providerUrl);

  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);

    // Basic connection check
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Provider connection successful");
    console.log("Current block number:", blockNumber);

    // Get network info
    const network = await provider.getNetwork();
    console.log("Network name:", network.name);
    console.log("Chain ID:", network.chainId);

    // Check admin account if ADMIN_PRIVATE_KEY is set
    const adminKey = process.env.ADMIN_PRIVATE_KEY;
    if (adminKey) {
      try {
        const wallet = new ethers.Wallet(adminKey, provider);
        console.log("Admin address:", wallet.address);

        const balance = await provider.getBalance(wallet.address);
        console.log("Admin balance (ETH):", ethers.formatEther(balance));

        if (balance === 0n || balance.toString() === "0") {
          console.warn(
            "⚠️ Warning: Admin account has zero balance. Will not be able to pay gas fees."
          );
        }
      } catch (err) {
        console.error("❌ Error with admin account:", err.message);
      }
    } else {
      console.warn("⚠️ No ADMIN_PRIVATE_KEY found in .env");
    }

    // Try to connect to the contract if CONTRACT_ADDRESS is available
    const contractAddress = "0xacea7fa9e319ca2f1cadce88dd023887d017f741";
    if (contractAddress) {
      try {
        // Check if contract exists at address (get code)
        const code = await provider.getCode(contractAddress);
        if (code === "0x") {
          console.error(
            `❌ No contract found at ${contractAddress} on this network`
          );
        } else {
          console.log("✅ Contract exists at the specified address");
          console.log("Contract code length:", (code.length - 2) / 2, "bytes");
        }
      } catch (err) {
        console.error("❌ Error checking contract:", err.message);
      }
    }
  } catch (err) {
    console.error("❌ Provider connection failed:", err.message);
    process.exit(1);
  }
}

main().catch(console.error);
