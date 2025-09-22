// Community authentication routes
const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Add JWT

// POST /api/auth/community/register - Community Registration
router.post("/register", async (req, res) => {
  console.log("🔵 Community Registration route hit!");
  console.log("📦 Request body:", req.body);

  const {
    community_name,
    spokesperson_name,
    spokesperson_mobile,
    email,
    password,
    pan_no,
    account_holder_name,
    account_number,
    ifsc_code,
  } = req.body;

  // Validate required fields
  if (!email || !password || !community_name) {
    console.log("❌ Validation failed: Missing required fields");
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields: email, password, and community_name are mandatory",
    });
  }

  try {
    console.log("🔑 Hashing password...");
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("💾 Attempting database insertion for Community...");
    const newCommunity = await pool.query(
      `INSERT INTO community (community_name, spokesperson_name, spokesperson_mobile, email, password, pan_no, account_holder_name, account_number, ifsc_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        community_name,
        spokesperson_name,
        spokesperson_mobile,
        email,
        hashedPassword,
        pan_no,
        account_holder_name,
        account_number,
        ifsc_code,
      ]
    );

    console.log("✅ Community inserted successfully:", {
      comm_id: newCommunity.rows[0].comm_id,
      email: newCommunity.rows[0].email,
    });

    res.status(201).json({
      success: true,
      message: "Community registered successfully!",
      community: newCommunity.rows[0],
    });
  } catch (error) {
    console.error("❌ Error in Community registration:", error.message);
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

// POST /api/auth/community/login - Community Login
router.post("/login", async (req, res) => {
  console.log("🔵 Community Login route hit!");
  console.log("📧 Login attempt for:", req.body.email);

  const { email, password } = req.body;

  try {
    // 1. Check if Community exists
    console.log("🔍 Checking if Community exists in database...");
    const community = await pool.query(
      "SELECT * FROM community WHERE email = $1",
      [email]
    );

    if (community.rows.length === 0) {
      console.log("❌ Community not found with email:", email);
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // 2. Check password
    console.log("🔑 Comparing password...");
    const isMatch = await bcrypt.compare(password, community.rows[0].password);

    if (!isMatch) {
      console.log("❌ Password doesn't match for:", email);
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // 3. Return community data (without password)
    console.log("✅ Community login successful:", {
      comm_id: community.rows[0].comm_id,
      email: community.rows[0].email,
    });
    const communityData = { ...community.rows[0] };
    delete communityData.password;

    // Generate JWT token
    const token = jwt.sign(
      {
        seller_id: communityData.comm_id,
        seller_type: "community",
        email: communityData.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      community: communityData,
      token: token,
    });
  } catch (error) {
    console.error("❌ Error in Community login:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

// GET /api/auth/community/profile - Get Community Profile
router.get("/profile", async (req, res) => {
  console.log("🔵 Community Profile Get route hit!");

  try {
    const { comm_id } = req.query;
    console.log("🔍 Fetching community profile for ID:", comm_id);

    if (!comm_id) {
      console.log("❌ Missing community ID in request");
      return res.status(400).json({
        success: false,
        error: "Community ID is required",
      });
    }

    const community = await pool.query(
      "SELECT comm_id, community_name, spokesperson_name, spokesperson_mobile, email, pan_no, account_holder_name, account_number, ifsc_code, is_verified, created_at FROM community WHERE comm_id = $1",
      [comm_id]
    );

    if (community.rows.length === 0) {
      console.log("❌ No community found with ID:", comm_id);
      return res.status(404).json({
        success: false,
        error: "Community not found",
      });
    }

    console.log("✅ Community profile fetched successfully:", { comm_id });
    res.json({
      success: true,
      community: community.rows[0],
    });
  } catch (error) {
    console.error("❌ Error in fetching Community profile:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

// PUT /api/auth/community/profile - Update Community Profile
router.put("/profile", async (req, res) => {
  console.log("🔵 Community Profile Update route hit!");
  console.log("📦 Update request body:", req.body);

  const { comm_id, ...updateData } = req.body;

  try {
    if (!comm_id) {
      console.log("❌ Missing community ID in update request");
      return res.status(400).json({
        success: false,
        error: "Community ID is required",
      });
    }

    console.log("🔄 Preparing update for fields:", Object.keys(updateData));
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [comm_id, ...Object.values(updateData)];

    console.log("💾 Executing database update...");
    const updatedCommunity = await pool.query(
      `UPDATE community SET ${setClause} WHERE comm_id = $1 RETURNING comm_id, community_name, spokesperson_name, spokesperson_mobile, email, pan_no, account_holder_name, account_number, ifsc_code, is_verified, created_at`,
      values
    );

    if (updatedCommunity.rows.length === 0) {
      console.log("❌ No community found with ID:", comm_id);
      return res.status(404).json({
        success: false,
        error: "Community not found",
      });
    }

    console.log("✅ Community profile updated successfully:", { comm_id });
    res.json({
      success: true,
      message: "Profile updated successfully",
      community: updatedCommunity.rows[0],
    });
  } catch (error) {
    console.error("❌ Error in updating Community profile:", error.message);
    console.error("Error stack:", error.stack);

    // Check for PostgreSQL-specific error codes
    if (error.code === "23505") {
      console.log("🔄 Duplicate key violation detected (email already exists)");
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

module.exports = router;
