/**
 * Authentication Service
 * Handles business logic for authentication operations
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as SellerModel from "../models/seller.model.js";
import * as BuyerModel from "../models/buyer.model.js";

// ==================== NGO AUTHENTICATION SERVICES ====================

/**
 * NGO Registration Service
 * @param {Object} ngoData - NGO registration data
 * @returns {Object} - Registered NGO data
 */
export const ngoRegisterService = async (ngoData) => {
  const {
    license_no,
    ngo_name,
    email,
    password,
    spokesperson_name,
    pan_no,
    account_holder_name,
    account_number,
    ifsc_code,
    wallet_address,
  } = ngoData;

  // Validate required fields
  if (!email || !password || !ngo_name) {
    throw new Error(
      "Missing required fields: email, password, and ngo_name are mandatory"
    );
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create NGO using model
    const newNgo = await SellerModel.createSeller({
      license_no,
      ngo_name,
      email,
      password: hashedPassword,
      spokesperson_name,
      pan_no,
      account_holder_name,
      account_number,
      ifsc_code,
      wallet_address,
    });

    return {
      success: true,
      message: "NGO registered successfully!",
      ngo: newNgo,
    };
  } catch (error) {
    // Handle PostgreSQL-specific errors
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    if (error.code === "23502") {
      throw new Error(`Missing required database field: ${error.detail}`);
    }
    if (error.code === "23503") {
      throw new Error(`Invalid reference to another table: ${error.detail}`);
    }
    throw error;
  }
};

/**
 * NGO Login Service
 * @param {Object} credentials - Email and password
 * @returns {Object} - Login response with token and NGO data
 */
export const ngoLoginService = async ({ email, password }) => {
  // Check if NGO exists using model
  const ngo = await SellerModel.getSellerByEmail(email);

  if (!ngo) {
    throw new Error("Invalid credentials");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, ngo.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      seller_id: ngo.ngo_id,
      seller_type: "ngo",
      email: ngo.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    success: true,
    message: "NGO logged in successfully!",
    token,
    ngo: {
      ngo_id: ngo.ngo_id,
      ngo_name: ngo.ngo_name,
      email: ngo.email,
    },
  };
};

// ==================== BUYER AUTHENTICATION SERVICES ====================

/**
 * Buyer Registration Service
 * @param {Object} buyerData - Buyer registration data
 * @returns {Object} - Registered buyer data
 */
export const buyerRegisterService = async (buyerData) => {
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

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create buyer using model
    const newBuyer = await BuyerModel.createBuyer({
      company_name,
      email,
      password: hashedPassword,
      pan_no,
      account_holder_name,
      account_number,
      ifsc_code,
      wallet_address: wallet_address || null,
    });

    return {
      message: "Buyer registered successfully",
      buyer: newBuyer,
    };
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

/**
 * Buyer Login Service
 * @param {Object} credentials - Email and password
 * @returns {Object} - Login response with token and buyer data
 */
export const buyerLoginService = async ({ email, password }) => {
  // Get buyer using model
  const buyer = await BuyerModel.getBuyerByEmail(email);

  if (!buyer) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, buyer.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Remove password before sending response
  const buyerData = { ...buyer };
  delete buyerData.password;

  // Generate JWT token
  const token = jwt.sign(
    {
      seller_id: buyerData.buyer_id,
      seller_type: "buyer",
      email: buyerData.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    message: "Login successful",
    buyer: buyerData,
    token: token,
  };
};

/**
 * Get Buyer Profile Service
 * @param {string} buyerId - Buyer ID
 * @returns {Object} - Buyer profile data
 */
export const getBuyerProfileService = async (buyerId) => {
  if (!buyerId) {
    throw new Error("Buyer ID is required");
  }

  // Get buyer using model
  const buyer = await BuyerModel.getBuyerById(buyerId);

  if (!buyer) {
    throw new Error("Buyer not found");
  }

  // Remove password from response
  const { password, ...buyerProfile } = buyer;

  return { buyer: buyerProfile };
};

/**
 * Update Buyer Profile Service
 * @param {string} buyerId - Buyer ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated buyer profile
 */
export const updateBuyerProfileService = async (buyerId, updateData) => {
  if (!buyerId) {
    throw new Error("Buyer ID is required");
  }

  // Update buyer using model
  const updatedBuyer = await BuyerModel.updateBuyer(buyerId, updateData);

  if (!updatedBuyer) {
    throw new Error("Buyer not found");
  }

  // Remove password from response
  const { password, ...buyerProfile } = updatedBuyer;

  return {
    message: "Profile updated successfully",
    buyer: buyerProfile,
  };
};
