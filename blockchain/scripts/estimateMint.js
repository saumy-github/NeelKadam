import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  PROVIDER_URL,
  contractABI,
  validateProviderUrl,
} from "./config.js";

validateProviderUrl();

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
