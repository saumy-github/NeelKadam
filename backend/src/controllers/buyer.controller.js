/**
 * Buyer Controller
 * Handles HTTP requests and responses for buyer operations
 */

import {
  getBuyerDashboardService,
  updateBuyerWalletService,
} from "../services/buyer.service.js";

/**
 * Get buyer dashboard data
 * GET /api/buyer/dashboard
 */
export const getBuyerDashboard = async (req, res) => {
  try {
    const buyerId = req.user.seller_id;
    const sellerType = req.user.seller_type;

    const result = await getBuyerDashboardService(buyerId, sellerType);

    res.json({
      success: true,
      dashboard: result,
    });
  } catch (error) {
    console.error("Buyer dashboard data fetch error:", error.message);

    if (
      error.message === "Invalid user credentials or not a buyer account" ||
      error.message === "Buyer profile not found"
    ) {
      return res.status(error.message.includes("Invalid") ? 400 : 404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error while fetching buyer dashboard data",
    });
  }
};

/**
 * Update buyer wallet address
 * PATCH /api/buyer/update-wallet
 */
export const updateBuyerWallet = async (req, res) => {
  try {
    const { wallet_address } = req.body;
    const buyerId = req.user.seller_id;
    const sellerType = req.user.seller_type;

    if (!wallet_address) {
      return res.status(400).json({
        success: false,
        error: "Wallet address is required",
      });
    }

    const result = await updateBuyerWalletService(
      buyerId,
      sellerType,
      wallet_address
    );

    res.json({
      success: true,
      message: "Wallet address updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating wallet address:", error.message);

    if (
      error.message === "Invalid user credentials or not a buyer account" ||
      error.message === "Buyer not found"
    ) {
      return res.status(error.message.includes("Invalid") ? 400 : 404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error while updating wallet address",
    });
  }
};
