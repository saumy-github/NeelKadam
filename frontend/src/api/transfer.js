// Transfer API - handles CC transfer operations

import apiClient from "./config";

// Transfer carbon credits from seller to buyer
export const transferCarbonCredits = async (
  buyer_wallet_address,
  amount,
  tx_hash
) => {
  console.log("📤 Calling backend API to transfer carbon credits...");
  console.log("Transfer details:", { buyer_wallet_address, amount, tx_hash });

  const response = await apiClient.post("/api/transfer/cc", {
    buyer_wallet_address,
    amount: Number(amount),
    tx_hash,
  });

  console.log("✅ Backend transfer API response:", response.data);
  return response.data;
};
