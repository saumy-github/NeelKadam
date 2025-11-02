// Transfer controller - handles CC transfer requests
// Follows admin approval flow pattern

import { transferCarbonCreditsService } from "../services/transfer.service.js";

// Transfer carbon credits from seller to buyer
// POST /api/transfer/cc
// Body: { buyer_company_name, amount, tx_hash }
export const transferCarbonCredits = async (req, res) => {
  console.log("🔵 Carbon Credit transfer route hit!");

  try {
    const { buyer_company_name, amount, tx_hash } = req.body;
    const sellerId = req.user.seller_id;
    const sellerType = req.user.seller_type;

    // Validate request body
    if (!buyer_company_name || !amount || !tx_hash) {
      console.log("❌ Missing required fields:", {
        buyer_company_name,
        amount,
        tx_hash,
      });
      return res.status(400).json({
        success: false,
        error: "buyer_company_name, amount, and tx_hash are required",
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      console.log("❌ Invalid amount:", amount);
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
    }

    console.log("📝 Transfer request details:", {
      sellerId,
      sellerType,
      buyer_company_name,
      amount,
      tx_hash,
    });

    const result = await transferCarbonCreditsService(
      sellerId,
      sellerType,
      buyer_company_name,
      amount,
      tx_hash
    );

    console.log("✅ Carbon credit transfer completed successfully!");
    res.json(result);
  } catch (error) {
    console.error("❌ Carbon credit transfer error:", error.message);
    console.error("Error stack:", error.stack);

    // Handle specific error cases
    if (
      error.message.includes("not found") ||
      error.message.includes("Invalid")
    ) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message.includes("Insufficient")) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error while transferring carbon credits",
    });
  }
};
