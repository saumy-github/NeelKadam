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
    // Cache for 1 minute on the client side
    res.setHeader("Cache-Control", "private, max-age=60");
    res.setHeader("Expires", new Date(Date.now() + 60000).toUTCString());

    const result = await getNgoDashboardService(ngoId);

    res.json({
      success: true,
      dashboard: result,
    });
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
