/**
 * Dashboard Controller
 * Handles HTTP requests and responses for dashboard operations
 */

import { getNgoDashboardService } from "../services/dashboard.service.js";

/**
 * Get NGO dashboard data
 * GET /api/dashboard/ngo
 */
export const getNgoDashboard = async (req, res) => {
  try {
    const ngoId = req.user.seller_id;

    if (!ngoId) {
      return res.status(400).json({
        success: false,
        error: "Invalid user credentials",
      });
    }

    // Set cache headers to prevent excessive requests
    // Cache for 30 seconds on the client side (reduced for demo purposes)
    res.setHeader("Cache-Control", "private, max-age=30");
    res.setHeader("Expires", new Date(Date.now() + 30000).toUTCString());

    const result = await getNgoDashboardService(ngoId);

    // Service already returns the full response object
    res.json(result);
  } catch (error) {
    console.error("Dashboard data fetch error:", error.message);

    if (error.message === "NGO profile not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error while fetching dashboard data",
    });
  }
};
