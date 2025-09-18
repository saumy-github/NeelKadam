// Buyer authentication routes
const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcryptjs");

// POST /api/auth/buyer/register - Buyer Registration
router.post("/register", async (req, res) => {
  const {
    company_name,
    email,
    password,
    pan_no,
    account_holder_name,
    account_number,
    ifsc_code,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBuyer = await pool.query(
      `INSERT INTO buyer (company_name, email, password, pan_no, account_holder_name, account_number, ifsc_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        company_name,
        email,
        hashedPassword,
        pan_no,
        account_holder_name,
        account_number,
        ifsc_code,
      ]
    );

    res.status(201).json({
      message: "Buyer registered successfully",
      buyer: newBuyer.rows[0],
    });
  } catch (error) {
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

// POST /api/auth/buyer/login - Buyer Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if Buyer exists
    const buyer = await pool.query("SELECT * FROM buyer WHERE email = $1", [
      email,
    ]);

    if (buyer.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, buyer.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // 3. Return buyer data (without password)
    const buyerData = { ...buyer.rows[0] };
    delete buyerData.password;

    res.json({
      message: "Login successful",
      buyer: buyerData,
      token: "dummy-token", // You can implement JWT here
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/auth/buyer/profile - Get Buyer Profile
router.get("/profile", async (req, res) => {
  try {
    // In a real app, you'd get the buyer_id from the JWT token
    const { buyer_id } = req.query;

    if (!buyer_id) {
      return res.status(400).json({
        error: "Buyer ID is required",
      });
    }

    const buyer = await pool.query(
      "SELECT buyer_id, company_name, email, phone, company_type, pan_no, account_holder_name, account_number, ifsc_code, is_verified, created_at FROM buyer WHERE buyer_id = $1",
      [buyer_id]
    );

    if (buyer.rows.length === 0) {
      return res.status(404).json({
        error: "Buyer not found",
      });
    }

    res.json({
      buyer: buyer.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PUT /api/auth/buyer/profile - Update Buyer Profile
router.put("/profile", async (req, res) => {
  const { buyer_id, ...updateData } = req.body;

  try {
    if (!buyer_id) {
      return res.status(400).json({
        error: "Buyer ID is required",
      });
    }

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [buyer_id, ...Object.values(updateData)];

    const updatedBuyer = await pool.query(
      `UPDATE buyer SET ${setClause} WHERE buyer_id = $1 RETURNING buyer_id, company_name, email, phone, company_type, pan_no, account_holder_name, account_number, ifsc_code, is_verified, created_at`,
      values
    );

    if (updatedBuyer.rows.length === 0) {
      return res.status(404).json({
        error: "Buyer not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      buyer: updatedBuyer.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
