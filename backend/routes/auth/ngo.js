// This file contains all NGO authentication-related API endpoints.

const express = require("express");
const router = express.Router();
const pool = require("../../db"); // Assuming db.js is in the parent directory
const bcrypt = require("bcryptjs");

// POST /api/auth/ngo/register - NGO Registration
router.post("/register", async (req, res) => {
  console.log("🔵 NGO Registration route hit!");
  console.log("📦 Request body:", req.body);

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
  } = req.body;

  // Validate required fields
  if (!email || !password || !ngo_name) {
    console.log("❌ Validation failed: Missing required fields");
    return res.status(400).json({
      error:
        "Missing required fields: email, password, and ngo_name are mandatory",
    });
  }

  try {
    console.log("🔑 Hashing password...");
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("💾 Attempting database insertion...");
    // Insert the new NGO into the database
    const newNgo = await pool.query(
      `INSERT INTO ngo (
        license_no, ngo_name, email, password, phone, spokesperson_name, 
        spokesperson_mobile, pan_no, account_holder_name, account_number, ifsc_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        license_no,
        ngo_name,
        email,
        hashedPassword,
        phone,
        spokesperson_name,
        spokesperson_mobile,
        pan_no,
        account_holder_name,
        account_number,
        ifsc_code,
      ]
    );

    res.status(201).json({
      success: true,
      message: "NGO registered successfully!",
      ngo: newNgo.rows[0],
    });
  } catch (error) {
    console.error("❌ Error in NGO registration:", error.message);
    console.error("Error stack:", error.stack);

    // Check for PostgreSQL-specific error codes
    if (error.code === "23505") {
      console.log("🔄 Duplicate key violation detected (email already exists)");
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    // Check for missing required fields in database
    if (error.code === "23502") {
      console.log("🚫 NOT NULL constraint violation:", error.detail);
      return res.status(400).json({
        success: false,
        error: "Missing required database field",
        detail: error.detail,
      });
    }

    // Check for other constraint violations
    if (error.code === "23503") {
      console.log("🔗 Foreign key constraint violation:", error.detail);
      return res.status(400).json({
        success: false,
        error: "Invalid reference to another table",
        detail: error.detail,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// POST /api/auth/ngo/login - NGO Login
router.post("/login", async (req, res) => {
  console.log("🔵 NGO Login route hit!");
  console.log("📧 Login attempt for:", req.body.email);

  const { email, password } = req.body;

  try {
    // 1. Check if NGO exists
    console.log("🔍 Checking if NGO exists in database...");
    const ngoResult = await pool.query("SELECT * FROM ngo WHERE email = $1", [
      email,
    ]);

    if (ngoResult.rows.length === 0) {
      console.log("❌ NGO not found with email:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const ngo = ngoResult.rows[0];

    // 2. Compare password
    console.log("🔑 Comparing password...");
    const isMatch = await bcrypt.compare(password, ngo.password);

    if (!isMatch) {
      console.log("❌ Password doesn't match for:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    console.log("✅ NGO login successful:", {
      ngo_id: ngo.ngo_id,
      email: ngo.email,
    });

    // 3. Login successful
    res.status(200).json({
      success: true,
      message: "NGO logged in successfully!",
      ngo: {
        ngo_id: ngo.ngo_id,
        ngo_name: ngo.ngo_name,
        email: ngo.email,
      },
    });
  } catch (error) {
    console.error("❌ Error in NGO login:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
