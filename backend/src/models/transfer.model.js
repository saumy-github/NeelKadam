// Transfer Model - handles database operations for CC transfers

import pool from "../config/database.config.js";

// Get seller by ID and type (ngo only)
export const getSellerByIdAndType = async (sellerId, sellerType) => {
  if (sellerType !== "ngo") {
    throw new Error("Invalid seller type. Only 'ngo' is supported");
  }

  const result = await pool.query(
    `SELECT ngo_id as id, ngo_name as name, total_cc, wallet_address 
     FROM ngo 
     WHERE ngo_id = $1`,
    [sellerId]
  );

  return result.rows[0] || null;
};

// Get buyer by company name
export const getBuyerByCompanyName = async (companyName) => {
  const result = await pool.query(
    "SELECT buyer_id, company_name, total_cc, wallet_address FROM buyer WHERE company_name = $1",
    [companyName]
  );

  return result.rows[0] || null;
};

// Update seller balance (reduce, ngo only)
export const updateSellerBalance = async (
  sellerId,
  sellerType,
  amount,
  client
) => {
  if (sellerType !== "ngo") {
    throw new Error("Invalid seller type. Only 'ngo' is supported");
  }

  const result = await client.query(
    `UPDATE ngo 
     SET total_cc = total_cc - $1, updated_at = NOW() 
     WHERE ngo_id = $2 
     RETURNING total_cc`,
    [amount, sellerId]
  );

  return result.rows[0];
};

// Update buyer balance (increase)
export const updateBuyerBalance = async (buyerId, amount, client) => {
  const result = await client.query(
    "UPDATE buyer SET total_cc = total_cc + $1, updated_at = NOW() WHERE buyer_id = $2 RETURNING total_cc",
    [amount, buyerId]
  );

  return result.rows[0];
};
