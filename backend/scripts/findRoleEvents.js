const { ethers } = require("ethers");
require("dotenv").config({ path: __dirname + "/../.env" });

const CONTRACT_ADDRESS = "0xacea7fa9e319ca2f1cadce88dd023887d017f741";
const PROVIDER_URL = process.env.PROVIDER_URL;
if (!PROVIDER_URL) {
  console.error("Set PROVIDER_URL in backend/.env before running this script");
  process.exit(1);
}

async function main() {
  const target = (process.argv[2] || "").trim();
  if (!target || !ethers.isAddress(target)) {
    console.error("Usage: node findRoleEvents.js <0x...address>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

  // role hash: try to compute the keccak of "NCCR_ROLE"
  const roleHash = ethers.keccak256(ethers.toUtf8Bytes("NCCR_ROLE"));
  console.log("Using role hash:", roleHash);

  // RoleGranted event signature
  const topic0 = ethers.id("RoleGranted(bytes32,address,address)");

  // topics: topic0, roleHash, account
  const accountTopic = ethers.hexlify(ethers.getAddress(target));
  // left-pad to 32 bytes for topic
  const accountTopicPadded = accountTopic.replace(/^0x/, "").padStart(64, "0");

  // topics require 0x-prefixed 32-byte hex
  const accountTopicFinal = "0x" + accountTopicPadded;

  const filter = {
    address: CONTRACT_ADDRESS,
    topics: [topic0, roleHash, accountTopicFinal],
  };

  console.log("Querying logs... this may take a few seconds");
  const logs = await provider.getLogs(filter);
  console.log("Found logs count:", logs.length);

  if (logs.length === 0) {
    console.log("No RoleGranted events found for that address and role.");
    process.exit(0);
  }

  const iface = new ethers.Interface([
    "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  ]);

  for (const log of logs) {
    let parsed;
    try {
      parsed = iface.parseLog(log);
    } catch (e) {
      console.log("Could not parse log:", e.message);
      continue;
    }
    console.log("---");
    console.log("txHash:", log.transactionHash);
    console.log("blockNumber:", log.blockNumber);
    console.log("role:", parsed.args.role);
    console.log("account:", parsed.args.account);
    console.log("grantedBy(sender):", parsed.args.sender);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
