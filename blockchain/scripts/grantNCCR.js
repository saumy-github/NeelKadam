import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  PROVIDER_URL,
  ADMIN_PRIVATE_KEY,
  contractABI,
} from "./config.js";

if (!PROVIDER_URL || !ADMIN_PRIVATE_KEY) {
  console.error(
    "Set PROVIDER_URL and ADMIN_PRIVATE_KEY in backend/.env before running this script"
  );
  process.exit(1);
}

async function main() {
  const target = process.argv[2];
  if (!target || !ethers.isAddress(target)) {
    console.error("Usage: node grantNCCR.js <0x...address>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    adminWallet
  );

  let role;
  try {
    role = await contract.NCCR_ROLE();
    console.log("NCCR_ROLE (from contract):", role);
  } catch (e) {
    role = ethers.keccak256(ethers.toUtf8Bytes("NCCR_ROLE"));
    console.log("NCCR_ROLE (computed):", role);
  }

  console.log("Granting role to", target, "from admin", adminWallet.address);
  const tx = await contract.grantRole(role, target);
  console.log("Sent grantRole tx:", tx.hash);
  const receipt = await tx.wait();
  console.log(
    "grantRole mined in block",
    receipt.blockNumber,
    "status",
    receipt.status
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
