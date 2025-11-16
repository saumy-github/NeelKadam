// Buyer controller - HTTP handlers for buyer operations

import {
  getBuyerDashboardService,
  updateBuyerWalletService,
} from "../services/buyer.service.js";
import { getBuyerByCompanyName } from "../models/transfer.model.js";

// Get buyer dashboard data - GET /api/buyer/dashboard
export const getBuyerDashboard = async (req, res) => {
  try {
    const buyerId = req.user.seller_id;
    const sellerType = req.user.seller_type;

    const result = await getBuyerDashboardService(buyerId, sellerType);

    // Service already returns the full response object
    res.json(result);
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

// Update buyer wallet address - PATCH /api/buyer/update-wallet
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

    // Service already returns the full response object
    res.json(result);
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

// Lookup buyer by company name - GET /api/buyer/lookup/:companyName
export const lookupBuyerByCompanyName = async (req, res) => {
  try {
    const companyName = decodeURIComponent(req.params.companyName);

    // Validate input
    if (!companyName || companyName.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Company name is required",
      });
    }

    console.log("🔍 Looking up buyer by company name:", companyName);

    // Query buyer by company name
    const buyer = await getBuyerByCompanyName(companyName);

    if (!buyer) {
      return res.status(404).json({
        success: false,
        error: "Buyer not found with the provided company name",
      });
    }

    // Return only necessary fields for security (simplified response)
    res.json({
      success: true,
      company_name: buyer.company_name,
      wallet_address: buyer.wallet_address,
    });
  } catch (error) {
    console.error("Buyer lookup error:", error.message);

    res.status(500).json({
      success: false,
      error: "Server error while looking up buyer",
    });
  }
};
