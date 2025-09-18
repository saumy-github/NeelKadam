// This file contains all NGO authentication-related API endpoints.

const express = require("express");
const router = express.Router();
const pool = require("../../db"); // Assuming db.js is in the parent directory
const bcrypt = require("bcryptjs");

// POST /api/auth/ngo/register - NGO Registration
router.post("/register", async (req, res) => {
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

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
    // ... (rest of the file remains the same)
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// POST /api/auth/ngo/login - NGO Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if NGO exists
    const ngoResult = await pool.query("SELECT * FROM ngo WHERE email = $1", [
      email,
    ]);

    if (ngoResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const ngo = ngoResult.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, ngo.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

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
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
