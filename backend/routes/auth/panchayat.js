// Coastal Panchayat authentication routes
import express from "express";
import pool from "../../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/panchayat/register - Panchayat Registration
router.post("/register", async (req, res) => {
  console.log("🔵 Coastal Panchayat Registration route hit!");
  console.log("📦 Request body:", req.body);

  const {
    zila_id_ward_no,
    address,
    email,
    password,
    phone,
    pan_no,
    account_holder_name,
    account_number,
    ifsc_code,
  } = req.body;

  // Validate required fields
  if (!email || !password || !address) {
    console.log("❌ Validation failed: Missing required fields");
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields: email, password, and address are mandatory",
    });
  }

  try {
    console.log("🔑 Hashing password...");
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("💾 Attempting database insertion for Coastal Panchayat...");
    const newPanchayat = await pool.query(
      `INSERT INTO coastal_panchayat (zila_id_ward_no, address, email, password, phone, pan_no, account_holder_name, account_number, ifsc_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        zila_id_ward_no,
        address,
        email,
        hashedPassword,
        phone,
        pan_no,
        account_holder_name,
        account_number,
        ifsc_code,
      ]
    );

    console.log("✅ Coastal Panchayat inserted successfully:", {
      cp_id: newPanchayat.rows[0].cp_id,
      email: newPanchayat.rows[0].email,
    });

    res.status(201).json({
      success: true,
      message: "Panchayat registered successfully!",
      panchayat: newPanchayat.rows[0],
    });
  } catch (error) {
    console.error("❌ Error in Panchayat registration:", error.message);
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
    console.error(error.message);
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Email already exists",
      });
    }
    res.status(500).json({
      error: "Server error",
    });
  }
});

// POST /api/auth/panchayat/login - Panchayat Login
router.post("/login", async (req, res) => {
  console.log("🔵 Coastal Panchayat Login route hit!");
  console.log("📧 Login attempt for:", req.body.email);

  const { email, password } = req.body;

  try {
    // 1. Check if Panchayat exists
    console.log("🔍 Checking if Panchayat exists in database...");
    const panchayat = await pool.query(
      "SELECT * FROM coastal_panchayat WHERE email = $1",
      [email]
    );

    if (panchayat.rows.length === 0) {
      console.log("❌ Panchayat not found with email:", email);
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // 2. Check password
    console.log("🔑 Comparing password...");
    const isMatch = await bcrypt.compare(password, panchayat.rows[0].password);

    if (!isMatch) {
      console.log("❌ Password doesn't match for:", email);
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // 3. Return panchayat data (without password)
    console.log("✅ Panchayat login successful:", {
      cp_id: panchayat.rows[0].cp_id,
      email: panchayat.rows[0].email,
    });
    const panchayatData = { ...panchayat.rows[0] };
    delete panchayatData.password;

    // Generate JWT token
    const token = jwt.sign(
      {
        seller_id: panchayatData.cp_id,
        seller_type: "panchayat",
        email: panchayatData.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      panchayat: panchayatData,
      token: token,
    });
  } catch (error) {
    console.error("❌ Error in Panchayat login:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/auth/panchayat/profile - Get Panchayat Profile
router.get("/profile", async (req, res) => {
  try {
    const { cp_id } = req.query;

    if (!cp_id) {
      return res.status(400).json({
        error: "Panchayat ID is required",
      });
    }

    const panchayat = await pool.query(
      "SELECT cp_id, zila_id_ward_no, address, email, phone, pan_no, account_holder_name, account_number, ifsc_code, is_verified, created_at FROM coastal_panchayat WHERE cp_id = $1",
      [cp_id]
    );

    if (panchayat.rows.length === 0) {
      return res.status(404).json({
        error: "Panchayat not found",
      });
    }

    res.json({
      panchayat: panchayat.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PUT /api/auth/panchayat/profile - Update Panchayat Profile
router.put("/profile", async (req, res) => {
  const { cp_id, ...updateData } = req.body;

  try {
    if (!cp_id) {
      return res.status(400).json({
        error: "Panchayat ID is required",
      });
    }

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [cp_id, ...Object.values(updateData)];

    const updatedPanchayat = await pool.query(
      `UPDATE coastal_panchayat SET ${setClause} WHERE cp_id = $1 RETURNING cp_id, zila_id_ward_no, address, email, phone, pan_no, account_holder_name, account_number, ifsc_code, is_verified, created_at`,
      values
    );

    if (updatedPanchayat.rows.length === 0) {
      return res.status(404).json({
        error: "Panchayat not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      panchayat: updatedPanchayat.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

export default router;
