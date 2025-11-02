/**
 * Dashboard API Routes
 *
 * This file contains endpoints for the dashboard functionality, specifically for NGO users.
 * It provides data needed to populate dashboard and profile pages, including:
 * - NGO profile information
 * - Project summary statistics
 * - Recent project activity
 *
 * All routes are protected by JWT authentication.
 */

import express from "express";
import { authMiddleware } from "../middleware/index.js";
import { getNgoDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

// GET /api/dashboard/ngo - Get NGO dashboard data
router.get("/ngo", authMiddleware, getNgoDashboard);

export default router;
