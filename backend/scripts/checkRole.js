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
  const target = process.argv[2];
  if (!target || !ethers.isAddress(target)) {
    console.error("Usage: node checkRole.js <0x...address>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    new ethers.JsonRpcProvider(PROVIDER_URL)
  );

  // Try to read NCCR_ROLE from contract ABI; if missing, compute the hash
  let role;
  try {
    if (typeof contract.NCCR_ROLE === "function") {
      role = await contract.NCCR_ROLE();
      console.log("NCCR_ROLE (from contract ABI):", role);
    } else {
      throw new Error("NCCR_ROLE not a function on provided ABI");
    }
  } catch (e) {
    role = ethers.keccak256(ethers.toUtf8Bytes("NCCR_ROLE"));
    console.log("NCCR_ROLE (computed):", role);
  }

  // Try to use hasRole/getRoleAdmin from provided ABI; if they aren't present, fall back to minimal AccessControl ABI
  try {
    if (typeof contract.hasRole === "function") {
      const has = await contract.hasRole(role, target);
      console.log(`${target} has NCCR role? ->`, has);
    } else {
      throw new Error("hasRole not a function on provided ABI");
    }
  } catch (err) {
    console.log(
      "Provided ABI doesn't expose hasRole/getRoleAdmin. Falling back to minimal AccessControl ABI."
    );
    const accessControlAbi = [
      "function hasRole(bytes32,address) view returns (bool)",
      "function getRoleAdmin(bytes32) view returns (bytes32)",
      "function grantRole(bytes32,address)",
      "function NCCR_ROLE() view returns (bytes32)",
    ];
    const minimalContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      accessControlAbi,
      provider
    );

    try {
      // If NCCR_ROLE exists on the contract, try to read it, else use computed value
      try {
        const roleFromContract = await minimalContract.NCCR_ROLE();
        if (roleFromContract) {
          role = roleFromContract;
          console.log("NCCR_ROLE (from minimal ABI):", role);
        }
      } catch (e) {
        // ignore; we'll use computed role
      }

      const has2 = await minimalContract.hasRole(role, target);
      console.log(`${target} has NCCR role? ->`, has2);

      try {
        const admin = await minimalContract.getRoleAdmin(role);
        console.log("Role admin (bytes32):", admin);
      } catch (e) {
        console.log(
          "getRoleAdmin not available or failed on minimal ABI:",
          e.message
        );
      }
    } catch (err2) {
      console.error("Fallback role check failed:", err2.message);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
