// Transfer Model - handles database operations for CC transfers

import pool from "../config/database.config.js";

// Get seller by ID and type (ngo, panchayat, community)
export const getSellerByIdAndType = async (sellerId, sellerType) => {
  let table, idColumn, nameColumn;

  if (sellerType === "ngo") {
    table = "ngo";
    idColumn = "ngo_id";
    nameColumn = "ngo_name";
  } else if (sellerType === "panchayat") {
    table = "coastal_panchayat";
    idColumn = "cp_id";
    nameColumn = "zila_id_ward_no";
  } else if (sellerType === "community") {
    table = "community";
    idColumn = "comm_id";
    nameColumn = "community_name";
  } else {
    throw new Error(`Invalid seller type: ${sellerType}`);
  }

  const result = await pool.query(
    `SELECT ${idColumn} as id, ${nameColumn} as name, total_cc, wallet_address 
     FROM ${table} 
     WHERE ${idColumn} = $1`,
    [sellerId]
  );

  return result.rows[0] || null;
};

// Get buyer by wallet address
export const getBuyerByWalletAddress = async (walletAddress) => {
  const result = await pool.query(
    "SELECT buyer_id, company_name, total_cc, wallet_address FROM buyer WHERE LOWER(wallet_address) = LOWER($1)",
    [walletAddress]
  );

  return result.rows[0] || null;
};

// Update seller balance (reduce)
export const updateSellerBalance = async (
  sellerId,
  sellerType,
  amount,
  client
) => {
  let table, idColumn;

  if (sellerType === "ngo") {
    table = "ngo";
    idColumn = "ngo_id";
  } else if (sellerType === "panchayat") {
    table = "coastal_panchayat";
    idColumn = "cp_id";
  } else if (sellerType === "community") {
    table = "community";
    idColumn = "comm_id";
  } else {
    throw new Error(`Invalid seller type: ${sellerType}`);
  }

  const result = await client.query(
    `UPDATE ${table} 
     SET total_cc = total_cc - $1, updated_at = NOW() 
     WHERE ${idColumn} = $2 
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
