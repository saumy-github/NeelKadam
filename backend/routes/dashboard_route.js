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
import pool from "../db.js";
import authMiddleware from "../middleware/auth_middleware.js";

const router = express.Router();

// GET /api/dashboard/ngo - Get NGO dashboard data
router.get("/ngo", authMiddleware, async (req, res) => {
  try {
    // Get NGO ID from authenticated user's JWT token
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

    // Fetch NGO profile information
    const ngoProfileQuery = await pool.query(
      "SELECT ngo_id, ngo_name, email, license_no, spokesperson_name, pan_no, created_at FROM ngo WHERE ngo_id = $1",
      [ngoId]
    );

    if (ngoProfileQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "NGO profile not found",
      });
    }

    const ngoProfile = ngoProfileQuery.rows[0];

    // Fetch all projects for this NGO
    const projectsQuery = await pool.query(
      "SELECT * FROM project WHERE seller_id = $1 AND seller_type = 'ngo' ORDER BY created_at DESC",
      [ngoId]
    );

    const projects = projectsQuery.rows;

    // Calculate summary statistics
    const totalProjects = projects.length;
    const pendingProjects = projects.filter(
      (p) => p.status === "pending"
    ).length;
    const mintedCarbonCredits = projects
      .filter((p) => p.status === "minted")
      .reduce((sum, p) => sum + (parseFloat(p.actual_cc) || 0), 0);

    // Get 5 most recent projects for activity feed
    const recentProjects = projects.slice(0, 5).map((p) => ({
      project_id: p.project_id,
      location: p.location,
      status: p.status,
      tree_type: p.tree_type,
      estimated_cc: p.estimated_cc,
      created_at: p.created_at,
    }));

    // Prepare and send response
    res.json({
      success: true,
      dashboard: {
        profile: ngoProfile,
        stats: {
          total_projects: totalProjects,
          pending_projects: pendingProjects,
          minted_carbon_credits: mintedCarbonCredits,
        },
        recent_activity: recentProjects,
      },
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error while fetching dashboard data",
    });
  }
});

export default router;
