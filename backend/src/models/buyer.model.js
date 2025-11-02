/**
 * Buyer Model
 * Handles database operations for the buyer table
 */

import pool from "../config/database.config.js";

/**
 * Create a new buyer
 * @param {Object} buyerData - Buyer data to insert
 * @returns {Object} - Created buyer record
 */
export const createBuyer = async (buyerData) => {
  const {
    company_name,
    email,
    password,
    pan_no,
    account_holder_name,
    account_number,
    ifsc_code,
    wallet_address,
  } = buyerData;

  const result = await pool.query(
    `INSERT INTO buyer (
      company_name, email, password, pan_no, account_holder_name, 
      account_number, ifsc_code, wallet_address, total_cc, is_verified, 
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, false, NOW(), NOW()) 
    RETURNING *`,
    [
      company_name,
      email,
      password,
      pan_no,
      account_holder_name,
      account_number,
      ifsc_code,
      wallet_address,
    ]
  );

  return result.rows[0];
};

/**
 * Get buyer by email
 * @param {string} email - Buyer email
 * @returns {Object|null} - Buyer record or null
 */
export const getBuyerByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM buyer WHERE email = $1", [
    email,
  ]);

  return result.rows[0] || null;
};

/**
 * Get buyer by ID
 * @param {number} buyerId - Buyer ID
 * @returns {Object|null} - Buyer record or null
 */
export const getBuyerById = async (buyerId) => {
  const result = await pool.query("SELECT * FROM buyer WHERE buyer_id = $1", [
    buyerId,
  ]);

  return result.rows[0] || null;
};

/**
 * Update buyer
 * @param {number} buyerId - Buyer ID
 * @param {Object} updateData - Data to update
 * @returns {Object|null} - Updated buyer record or null
 */
export const updateBuyer = async (buyerId, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) {
    return null;
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");

  const result = await pool.query(
    `UPDATE buyer 
     SET ${setClause}, updated_at = NOW() 
     WHERE buyer_id = $1 
     RETURNING *`,
    [buyerId, ...values]
  );

  return result.rows[0] || null;
};

/**
 * Delete buyer
 * @param {number} buyerId - Buyer ID
 * @returns {Object|null} - Deleted buyer record or null
 */
export const deleteBuyer = async (buyerId) => {
  const result = await pool.query(
    "DELETE FROM buyer WHERE buyer_id = $1 RETURNING *",
    [buyerId]
  );

  return result.rows[0] || null;
};
