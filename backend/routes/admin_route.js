// Admin protected routes
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth_middleware");

// GET /projects - Get all projects for verification with seller name
// Protected route - requires authentication
router.get("/projects", authMiddleware, async (req, res) => {
  try {
    // SQL query to fetch all projects and join with seller tables to get seller name
    const query = `
      SELECT 
        p.*,
        COALESCE(
          n.ngo_name, 
          cp.zila_id_ward_no, 
          c.community_name
        ) AS seller_name
      FROM 
        project p
      LEFT JOIN 
        ngo n ON p.seller_id = n.ngo_id AND p.seller_type = 'ngo'
      LEFT JOIN 
        coastal_panchayat cp ON p.seller_id = cp.cp_id AND p.seller_type = 'panchayat'
      LEFT JOIN 
        community c ON p.seller_id = c.comm_id AND p.seller_type = 'community'
      ORDER BY 
        p.created_at DESC
    `;

    const result = await pool.query(query);

    res.json({
      projects: result.rows,
    });
  } catch (error) {
    console.error("Error fetching projects for verification:", error.message);
    res.status(500).json({
      error: "Server error fetching projects for verification",
    });
  }
});

module.exports = router;
