/**
 * Buyer API Routes
 *
 * This file contains all buyer-specific endpoints, including:
 * - Dashboard data for buyer profile and statistics
 * - Transaction history
 * - Carbon credit management
 * - Buyer profile management (update wallet address, etc.)
 *
 * All routes are protected by JWT authentication.
 */

import express from "express";
import { authMiddleware } from "../middleware/index.js";
import {
  getBuyerDashboard,
  updateBuyerWallet,
} from "../controllers/buyer.controller.js";

const router = express.Router();

// GET /api/buyer/dashboard - Get buyer dashboard data
router.get("/dashboard", authMiddleware, getBuyerDashboard);

// PATCH /api/buyer/update-wallet - Update buyer wallet address
router.patch("/update-wallet", authMiddleware, updateBuyerWallet);

export default router;
