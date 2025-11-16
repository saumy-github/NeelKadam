// Seller model (NGO) - database operations for the `ngo` table

import pool from "../config/database.config.js";

// Create a new NGO seller
export const createSeller = async (sellerData) => {
  const {
    license_no,
    ngo_name,
    email,
    password,
    phone,
    spokesperson_name,
    spokesperson_mobile,
    pan_no,
    account_holder_name,
    account_number,
    ifsc_code,
    wallet_address,
  } = sellerData;

  const result = await pool.query(
    `INSERT INTO ngo (
      license_no, ngo_name, email, password, phone, spokesperson_name, 
      spokesperson_mobile, pan_no, account_holder_name, account_number, 
      ifsc_code, wallet_address, total_cc, is_verified, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0, false, NOW(), NOW()) 
    RETURNING *`,
    [
      license_no,
      ngo_name,
      email,
      password,
      phone,
      spokesperson_name,
      spokesperson_mobile,
      pan_no,
      account_holder_name,
      account_number,
      ifsc_code,
      wallet_address,
    ]
  );

  return result.rows[0];
};

// Get NGO seller by email
export const getSellerByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM ngo WHERE email = $1", [
    email,
  ]);

  return result.rows[0] || null;
};

// Get NGO seller by ID
export const getSellerById = async (ngoId) => {
  const result = await pool.query("SELECT * FROM ngo WHERE ngo_id = $1", [
    ngoId,
  ]);

  return result.rows[0] || null;
};

// Update NGO seller (partial updates supported)
export const updateSeller = async (ngoId, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) {
    return null;
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");

  const result = await pool.query(
    `UPDATE ngo 
     SET ${setClause}, updated_at = NOW() 
     WHERE ngo_id = $1 
     RETURNING *`,
    [ngoId, ...values]
  );

  return result.rows[0] || null;
};

// Delete NGO seller
export const deleteSeller = async (ngoId) => {
  const result = await pool.query(
    "DELETE FROM ngo WHERE ngo_id = $1 RETURNING *",
    [ngoId]
  );

  return result.rows[0] || null;
};
