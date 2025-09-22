const { ethers } = require("ethers");
require("dotenv").config({ path: __dirname + "/../.env" });
const contractABI = require("../../blockchain/abi.json");

const CONTRACT_ADDRESS = "0xacea7fa9e319ca2f1cadce88dd023887d017f741";
const PROVIDER_URL = process.env.PROVIDER_URL;
if (!PROVIDER_URL) {
  console.error("Set PROVIDER_URL in backend/.env before running this script");
  process.exit(1);
}

async function main() {
  const ngo = process.argv[2];
  const amount = Number(process.argv[3] || 1);
  if (!ngo || !ethers.isAddress(ngo)) {
    console.error("Usage: node estimateMint.js <ngoAddress> <amount>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

  try {
    const estimated = await contract.estimateGas.generateCredits(ngo, amount);
    const feeData = await provider.getFeeData();
    console.log("Estimated gas:", estimated.toString());
    console.log(
      "Suggested maxFeePerGas:",
      feeData.maxFeePerGas?.toString() || feeData.gasPrice?.toString() || "n/a"
    );
    const gasPrice = feeData.maxFeePerGas || feeData.gasPrice || 0;
    console.log("Estimated cost (wei):", estimated.mul(gasPrice).toString());
    console.log(
      "Estimated cost (ETH):",
      ethers.formatEther(estimated.mul(gasPrice).toString())
    );
  } catch (err) {
    console.error("Estimate failed:", err.message);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
