const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const {
    company_name,
    email,
    password,
    pan_no,
    account_holder_name,
    account_number,
    ifsc_code,
    wallet_address,
  } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBuyer = await pool.query(
      `INSERT INTO buyer 
        (company_name, email, password, pan_no, account_holder_name, account_number, ifsc_code, wallet_address, total_cc, is_verified, created_at, updated_at) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, 0, false, NOW(), NOW()) 
       RETURNING *`,
      [
        company_name,
        email,
        hashedPassword,
        pan_no,
        account_holder_name,
        account_number,
        ifsc_code,
        wallet_address || null, // can be null at signup
      ]
    );

    res.status(201).json({
      message: "Buyer registered successfully",
      buyer: newBuyer.rows[0],
    });
  } catch (error) {
    console.error("Register error:", error.message);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const buyer = await pool.query("SELECT * FROM buyer WHERE email = $1", [
      email,
    ]);

    if (buyer.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, buyer.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Remove password before sending response
    const buyerData = { ...buyer.rows[0] };
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

    res.json({
      message: "Login successful",
      buyer: buyerData,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= PROFILE GET =================
router.get("/profile", async (req, res) => {
  try {
    const { buyer_id } = req.query;

    if (!buyer_id) {
      return res.status(400).json({ error: "Buyer ID is required" });
    }

    const buyer = await pool.query(
      `SELECT buyer_id, company_name, email, pan_no, account_holder_name, account_number, ifsc_code, wallet_address, total_cc, is_verified, created_at, updated_at 
       FROM buyer WHERE buyer_id = $1`,
      [buyer_id]
    );

    if (buyer.rows.length === 0) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    res.json({ buyer: buyer.rows[0] });
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= PROFILE UPDATE =================
router.put("/profile", async (req, res) => {
  const { buyer_id, ...updateData } = req.body;

  try {
    if (!buyer_id) {
      return res.status(400).json({ error: "Buyer ID is required" });
    }

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [buyer_id, ...Object.values(updateData)];

    const updatedBuyer = await pool.query(
      `UPDATE buyer SET ${setClause}, updated_at = NOW() 
       WHERE buyer_id = $1 
       RETURNING buyer_id, company_name, email, phone, pan_no, account_holder_name, account_number, ifsc_code, wallet_address, total_cc, is_verified, created_at, updated_at`,
      values
    );

    if (updatedBuyer.rows.length === 0) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    res.json({
      message: "Profile updated successfully",
      buyer: updatedBuyer.rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
