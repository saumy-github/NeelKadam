// Buyer service - business logic for buyer operations

import * as BuyerModel from "../models/buyer.model.js";

// Get buyer dashboard data service
export const getBuyerDashboardService = async (buyerId, sellerType) => {
  if (!buyerId || sellerType !== "buyer") {
    throw new Error("Invalid user credentials or not a buyer account");
  }

  // Fetch buyer profile using model
  const buyerProfile = await BuyerModel.getBuyerById(buyerId);

  if (!buyerProfile) {
    throw new Error("Buyer profile not found");
  }

  // Remove password from profile
  const { password, ...profileWithoutPassword } = buyerProfile;

  // Get transaction history (placeholder for future implementation)
  const transactions = [];

  return {
    success: true,
    dashboard: {
      profile: profileWithoutPassword,
      stats: {
        total_credits_owned: buyerProfile.total_cc || 0,
      },
      transactions: transactions,
    },
  };
};

// Update buyer wallet address service
export const updateBuyerWalletService = async (
  buyerId,
  sellerType,
  wallet_address
) => {
  if (!buyerId || sellerType !== "buyer") {
    throw new Error("Invalid user credentials or not a buyer account");
  }

  if (!wallet_address) {
    throw new Error("Wallet address is required");
  }

  // Update wallet address using model
  const updatedBuyer = await BuyerModel.updateBuyer(buyerId, {
    wallet_address,
  });

  if (!updatedBuyer) {
    throw new Error("Buyer not found");
  }

  return {
    success: true,
    message: "Wallet address updated successfully",
    data: {
      buyer_id: updatedBuyer.buyer_id,
      wallet_address: updatedBuyer.wallet_address,
    },
  };
};
