// Buyer authentication routes
import express from "express";
import {
  buyerRegister,
  buyerLogin,
  getBuyerProfile,
  updateBuyerProfile,
} from "../../controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/buyer/register - Buyer Registration
router.post("/register", buyerRegister);

// POST /api/auth/buyer/login - Buyer Login
router.post("/login", buyerLogin);

// GET /api/auth/buyer/profile - Get Buyer Profile
router.get("/profile", getBuyerProfile);

// PUT /api/auth/buyer/profile - Update Buyer Profile
router.put("/profile", updateBuyerProfile);

export default router;
