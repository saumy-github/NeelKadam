// Authentication controller - HTTP handlers for auth operations

import {
  ngoRegisterService,
  ngoLoginService,
  buyerRegisterService,
  buyerLoginService,
  getBuyerProfileService,
  updateBuyerProfileService,
} from "../services/auth.service.js";

// ==================== NGO AUTHENTICATION ====================

// NGO registration - POST /api/auth/ngo/register
export const ngoRegister = async (req, res) => {
  console.log("🔵 NGO Registration route hit!");
  console.log("📦 Request body:", req.body);

  try {
    console.log("🔍 Calling NGO registration service...");
    const result = await ngoRegisterService(req.body);

    console.log("✅ NGO registration successful");
    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Error in NGO registration:", error.message);

    // Handle specific error messages from service
    if (
      error.message === "Email already exists" ||
      error.message.includes("Missing required")
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// NGO login - POST /api/auth/ngo/login
export const ngoLogin = async (req, res) => {
  console.log("🔵 NGO Login route hit!");
  console.log("📧 Login attempt for:", req.body.email);

  try {
    console.log("🔍 Calling NGO login service...");
    const result = await ngoLoginService(req.body);

    console.log("✅ NGO login successful");
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error in NGO login:", error.message);

    // Handle authentication errors
    if (error.message === "Invalid credentials") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== BUYER AUTHENTICATION ====================

// Buyer registration - POST /api/auth/buyer/register
export const buyerRegister = async (req, res) => {
  try {
    const result = await buyerRegisterService(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Register error:", error.message);

    if (error.message === "Email already exists") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Server error" });
  }
};

// Buyer login - POST /api/auth/buyer/login
export const buyerLogin = async (req, res) => {
  try {
    const result = await buyerLoginService(req.body);
    res.json(result);
  } catch (error) {
    console.error("Login error:", error.message);

    if (error.message === "Invalid credentials") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Server error" });
  }
};

// Get buyer profile - GET /api/auth/buyer/profile
export const getBuyerProfile = async (req, res) => {
  try {
    const { buyer_id } = req.query;
    const result = await getBuyerProfileService(buyer_id);
    res.json(result);
  } catch (error) {
    console.error("Profile error:", error.message);

    if (
      error.message === "Buyer ID is required" ||
      error.message === "Buyer not found"
    ) {
      const statusCode = error.message === "Buyer not found" ? 404 : 400;
      return res.status(statusCode).json({ error: error.message });
    }

    res.status(500).json({ error: "Server error" });
  }
};

// Update buyer profile - PUT /api/auth/buyer/profile
export const updateBuyerProfile = async (req, res) => {
  try {
    const { buyer_id, ...updateData } = req.body;
    const result = await updateBuyerProfileService(buyer_id, updateData);
    res.json(result);
  } catch (error) {
    console.error("Update profile error:", error.message);

    if (
      error.message === "Buyer ID is required" ||
      error.message === "Buyer not found"
    ) {
      const statusCode = error.message === "Buyer not found" ? 404 : 400;
      return res.status(statusCode).json({ error: error.message });
    }

    res.status(500).json({ error: "Server error" });
  }
};
