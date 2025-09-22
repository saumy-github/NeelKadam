/**
 * Buyer API Routes
 *
 * This file contains all buyer-specific endpoints, including:
 * - Dashboard data for buyer profile and statistics
 * - Transaction history
 * - Carbon credit management
 * - Buyer profile management (update wallet address, etc.)
 *
 * All routes are protected by JWT authentication.
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth_middleware"); // GET /api/buyer/dashboard - Get buyer dashboard data
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    // Get buyer ID from authenticated user's JWT token
    // Note: In the JWT, buyer_id is stored as seller_id with seller_type="buyer"
    const buyerId = req.user.seller_id;
    const sellerType = req.user.seller_type;

    if (!buyerId || sellerType !== "buyer") {
      return res.status(400).json({
        success: false,
        error: "Invalid user credentials or not a buyer account",
      });
    }

    // Fetch buyer profile information
    const buyerProfileQuery = await pool.query(
      `SELECT 
        buyer_id, 
        company_name, 
        email, 
        pan_no, 
        account_holder_name, 
        account_number, 
        ifsc_code, 
        total_cc, 
        wallet_address, 
        is_verified, 
        created_at, 
        updated_at 
      FROM buyer 
      WHERE buyer_id = $1`,
      [buyerId]
    );

    if (buyerProfileQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Buyer profile not found",
      });
    }

    const buyerProfile = buyerProfileQuery.rows[0];

    // Get transaction history (placeholder for future implementation)
    // This would typically connect to the transaction table or blockchain data
    const transactions = [];

    // Prepare and send response
    res.json({
      success: true,
      dashboard: {
        profile: buyerProfile,
        stats: {
          total_credits_owned: buyerProfile.total_cc || 0,
          // Additional statistics can be added here
        },
        transactions: transactions,
      },
    });
  } catch (error) {
    console.error("Buyer dashboard data fetch error:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error while fetching buyer dashboard data",
    });
  }
});

// PATCH /api/buyer/update-wallet - Update buyer wallet address
router.patch("/update-wallet", authMiddleware, async (req, res) => {
  try {
    const { wallet_address } = req.body;
    const buyerId = req.user.seller_id;
    const sellerType = req.user.seller_type;

    if (!buyerId || sellerType !== "buyer") {
      return res.status(400).json({
        success: false,
        error: "Invalid user credentials or not a buyer account",
      });
    }

    if (!wallet_address) {
      return res.status(400).json({
        success: false,
        error: "Wallet address is required",
      });
    }

    // Update the wallet address in the database
    const updateResult = await pool.query(
      `UPDATE buyer 
       SET wallet_address = $1, updated_at = NOW() 
       WHERE buyer_id = $2
       RETURNING buyer_id, wallet_address`,
      [wallet_address, buyerId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Buyer not found",
      });
    }

    res.json({
      success: true,
      message: "Wallet address updated successfully",
      data: {
        buyer_id: updateResult.rows[0].buyer_id,
        wallet_address: updateResult.rows[0].wallet_address,
      },
    });
  } catch (error) {
    console.error("Error updating wallet address:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error while updating wallet address",
    });
  }
});

module.exports = router;
