// Transfer service - handles CC transfer business logic
// Follows admin approval flow pattern

import pool from "../config/database.config.js";
import * as TransferModel from "../models/transfer.model.js";

// Transfer carbon credits from seller to buyer
// Supports all seller types: ngo, panchayat, community
export const transferCarbonCreditsService = async (
  sellerId,
  sellerType,
  buyerWalletAddress,
  amount,
  txHash
) => {
  console.log("🔍 Starting carbon credit transfer service...");

  // Validate seller type
  if (!["ngo", "panchayat", "community"].includes(sellerType)) {
    throw new Error(
      `Invalid seller type: ${sellerType}. Must be 'ngo', 'panchayat', or 'community'.`
    );
  }

  const client = await pool.connect();

  try {
    // Start transaction
    console.log("🔄 Starting database transaction...");
    await client.query("BEGIN");

    // Get seller details using model
    console.log(`🔍 Fetching ${sellerType} details for ID: ${sellerId}...`);
    const seller = await TransferModel.getSellerByIdAndType(
      sellerId,
      sellerType
    );

    if (!seller) {
      throw new Error(`${sellerType} not found`);
    }

    console.log(`📊 ${sellerType} current balance: ${seller.total_cc} CC`);

    // Verify sufficient balance
    if (seller.total_cc < amount) {
      throw new Error(
        `Insufficient carbon credits. Available: ${seller.total_cc}, Required: ${amount}`
      );
    }

    // Find buyer by wallet address using model
    console.log(
      `🔍 Finding buyer with wallet address: ${buyerWalletAddress}...`
    );
    const buyer = await TransferModel.getBuyerByWalletAddress(
      buyerWalletAddress
    );

    if (!buyer) {
      throw new Error("Buyer not found with the provided wallet address");
    }

    console.log(`📊 Buyer current balance: ${buyer.total_cc} CC`);

    // Update seller balance using model
    console.log(`🔍 Reducing ${sellerType} balance by ${amount} CC...`);
    const updatedSeller = await TransferModel.updateSellerBalance(
      sellerId,
      sellerType,
      amount,
      client
    );
    console.log(
      `✅ ${sellerType} balance updated. New balance: ${updatedSeller.total_cc} CC`
    );

    // Update buyer balance using model
    console.log(`🔍 Increasing buyer balance by ${amount} CC...`);
    const updatedBuyer = await TransferModel.updateBuyerBalance(
      buyer.buyer_id,
      amount,
      client
    );
    console.log(
      `✅ Buyer balance updated. New balance: ${updatedBuyer.total_cc} CC`
    );

    // Commit transaction
    await client.query("COMMIT");
    console.log("✅ Database transaction committed successfully!");

    // Build response with seller info
    return {
      success: true,
      message: "Carbon credits transferred successfully",
      data: {
        from: {
          seller_id: sellerId,
          seller_type: sellerType,
          seller_name: seller.name,
          previous_balance: seller.total_cc,
          new_balance: updatedSeller.total_cc,
        },
        to: {
          buyer_id: buyer.buyer_id,
          company_name: buyer.company_name,
          previous_balance: buyer.total_cc,
          new_balance: updatedBuyer.total_cc,
        },
        amount: amount,
        tx_hash: txHash,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    // Rollback on error
    await client.query("ROLLBACK");
    console.log("🔄 Database transaction rolled back due to error");
    throw error;
  } finally {
    client.release();
    console.log("🔓 Database connection released");
  }
};
