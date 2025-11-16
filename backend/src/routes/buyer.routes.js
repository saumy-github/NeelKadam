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
import { authMiddleware } from "../middleware/index.middleware.js";
import {
  getBuyerDashboard,
  updateBuyerWallet,
  lookupBuyerByCompanyName,
} from "../controllers/buyer.controller.js";

const router = express.Router();

// GET /api/buyer/dashboard - Get buyer dashboard data
router.get("/dashboard", authMiddleware, getBuyerDashboard);

// PATCH /api/buyer/update-wallet - Update buyer wallet address
router.patch("/update-wallet", authMiddleware, updateBuyerWallet);

// GET /api/buyer/lookup/:companyName - Lookup buyer by company name
router.get("/lookup/:companyName", authMiddleware, lookupBuyerByCompanyName);

export default router;
