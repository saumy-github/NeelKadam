// Admin management routes
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");

// POST /api/admin/login - Admin Login (placeholder - you'll need to create admin table)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // For now, using a simple hardcoded admin check
    if (email === "admin@bluecarbon.com" && password === "admin123") {
      res.json({
        message: "Admin login successful",
        admin: { email: "admin@bluecarbon.com", role: "admin" },
        token: "admin-dummy-token",
      });
    } else {
      res.status(400).json({
        error: "Invalid admin credentials",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/ngos - Get all NGOs
router.get("/ngos", async (req, res) => {
  try {
    const { verified, search } = req.query;

    let query =
      "SELECT ngo_id, license_no, ngo_name, email, phone, spokesperson_name, spokesperson_mobile, is_verified, created_at FROM ngo WHERE 1=1";
    let params = [];
    let paramCount = 0;

    if (verified !== undefined) {
      paramCount++;
      query += ` AND is_verified = $${paramCount}`;
      params.push(verified === "true");
    }

    if (search) {
      paramCount++;
      query += ` AND (ngo_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";

    const ngos = await pool.query(query, params);

    res.json({
      ngos: ngos.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/buyers - Get all Buyers
router.get("/buyers", async (req, res) => {
  try {
    const { verified, search } = req.query;

    let query =
      "SELECT buyer_id, company_name, email, phone, company_type, pan_no, account_holder_name, is_verified, created_at FROM buyer WHERE 1=1";
    let params = [];
    let paramCount = 0;

    if (verified !== undefined) {
      paramCount++;
      query += ` AND is_verified = $${paramCount}`;
      params.push(verified === "true");
    }

    if (search) {
      paramCount++;
      query += ` AND (company_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";

    const buyers = await pool.query(query, params);

    res.json({
      buyers: buyers.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/panchayats - Get all Panchayats
router.get("/panchayats", async (req, res) => {
  try {
    const { verified, search } = req.query;

    let query =
      "SELECT cp_id, zila_id_ward_no, address, email, phone, pan_no, account_holder_name, is_verified, created_at FROM coastal_panchayat WHERE 1=1";
    let params = [];
    let paramCount = 0;

    if (verified !== undefined) {
      paramCount++;
      query += ` AND is_verified = $${paramCount}`;
      params.push(verified === "true");
    }

    if (search) {
      paramCount++;
      query += ` AND (zila_id_ward_no ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";

    const panchayats = await pool.query(query, params);

    res.json({
      panchayats: panchayats.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/communities - Get all Communities
router.get("/communities", async (req, res) => {
  try {
    const { verified, search } = req.query;

    let query =
      "SELECT comm_id, community_name, spokesperson_name, spokesperson_mobile, email, pan_no, account_holder_name, is_verified, created_at FROM community WHERE 1=1";
    let params = [];
    let paramCount = 0;

    if (verified !== undefined) {
      paramCount++;
      query += ` AND is_verified = $${paramCount}`;
      params.push(verified === "true");
    }

    if (search) {
      paramCount++;
      query += ` AND (community_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";

    const communities = await pool.query(query, params);

    res.json({
      communities: communities.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/projects - Get all Projects
router.get("/projects", async (req, res) => {
  try {
    const { status, seller_type, location } = req.query;

    let query = "SELECT * FROM project WHERE 1=1";
    let params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (seller_type) {
      paramCount++;
      query += ` AND seller_type = $${paramCount}`;
      params.push(seller_type);
    }

    if (location) {
      paramCount++;
      query += ` AND location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
    }

    query += " ORDER BY created_at DESC";

    const projects = await pool.query(query, params);

    res.json({
      projects: projects.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/transactions - Get all Transactions (placeholder)
router.get("/transactions", async (req, res) => {
  try {
    // This would need a transactions table
    res.json({
      transactions: [],
      message: "Transactions feature needs to be implemented",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PATCH /api/admin/ngos/:id/verify - Verify NGO
router.patch("/ngos/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const updatedNGO = await pool.query(
      "UPDATE ngo SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE ngo_id = $2 RETURNING ngo_id, ngo_name, email, is_verified",
      [verified, id]
    );

    if (updatedNGO.rows.length === 0) {
      return res.status(404).json({
        error: "NGO not found",
      });
    }

    res.json({
      message: `NGO ${verified ? "verified" : "unverified"} successfully`,
      ngo: updatedNGO.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PATCH /api/admin/buyers/:id/verify - Verify Buyer
router.patch("/buyers/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const updatedBuyer = await pool.query(
      "UPDATE buyer SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE buyer_id = $2 RETURNING buyer_id, company_name, email, is_verified",
      [verified, id]
    );

    if (updatedBuyer.rows.length === 0) {
      return res.status(404).json({
        error: "Buyer not found",
      });
    }

    res.json({
      message: `Buyer ${verified ? "verified" : "unverified"} successfully`,
      buyer: updatedBuyer.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PATCH /api/admin/panchayats/:id/verify - Verify Panchayat
router.patch("/panchayats/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const updatedPanchayat = await pool.query(
      "UPDATE coastal_panchayat SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE cp_id = $2 RETURNING cp_id, zila_id_ward_no, email, is_verified",
      [verified, id]
    );

    if (updatedPanchayat.rows.length === 0) {
      return res.status(404).json({
        error: "Panchayat not found",
      });
    }

    res.json({
      message: `Panchayat ${verified ? "verified" : "unverified"} successfully`,
      panchayat: updatedPanchayat.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PATCH /api/admin/communities/:id/verify - Verify Community
router.patch("/communities/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const updatedCommunity = await pool.query(
      "UPDATE community SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE comm_id = $2 RETURNING comm_id, community_name, email, is_verified",
      [verified, id]
    );

    if (updatedCommunity.rows.length === 0) {
      return res.status(404).json({
        error: "Community not found",
      });
    }

    res.json({
      message: `Community ${verified ? "verified" : "unverified"} successfully`,
      community: updatedCommunity.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PATCH /api/admin/projects/:id/approve - Approve Project
router.patch("/projects/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const status = approved ? "approved" : "rejected";

    const updatedProject = await pool.query(
      "UPDATE project SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE project_id = $2 RETURNING project_id, plantation_area, status",
      [status, id]
    );

    if (updatedProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json({
      message: `Project ${approved ? "approved" : "rejected"} successfully`,
      project: updatedProject.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/dashboard/stats - Get Dashboard Statistics
router.get("/dashboard/stats", async (req, res) => {
  try {
    const [
      ngosResult,
      buyersResult,
      panchayatsResult,
      communitiesResult,
      projectsResult,
    ] = await Promise.all([
      pool.query(
        "SELECT COUNT(*) as total, COUNT(CASE WHEN is_verified = true THEN 1 END) as verified FROM ngo"
      ),
      pool.query(
        "SELECT COUNT(*) as total, COUNT(CASE WHEN is_verified = true THEN 1 END) as verified FROM buyer"
      ),
      pool.query(
        "SELECT COUNT(*) as total, COUNT(CASE WHEN is_verified = true THEN 1 END) as verified FROM coastal_panchayat"
      ),
      pool.query(
        "SELECT COUNT(*) as total, COUNT(CASE WHEN is_verified = true THEN 1 END) as verified FROM community"
      ),
      pool.query(
        "SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved, COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending FROM project"
      ),
    ]);

    const stats = {
      ngos: {
        total: parseInt(ngosResult.rows[0].total),
        verified: parseInt(ngosResult.rows[0].verified),
      },
      buyers: {
        total: parseInt(buyersResult.rows[0].total),
        verified: parseInt(buyersResult.rows[0].verified),
      },
      panchayats: {
        total: parseInt(panchayatsResult.rows[0].total),
        verified: parseInt(panchayatsResult.rows[0].verified),
      },
      communities: {
        total: parseInt(communitiesResult.rows[0].total),
        verified: parseInt(communitiesResult.rows[0].verified),
      },
      projects: {
        total: parseInt(projectsResult.rows[0].total),
        approved: parseInt(projectsResult.rows[0].approved),
        pending: parseInt(projectsResult.rows[0].pending),
      },
    };

    res.json({ stats });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/admin/reports/:type - Get Reports
router.get("/reports/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    let query;
    let params = [];

    switch (type) {
      case "registrations":
        query = `
          SELECT 
            DATE_TRUNC('day', created_at) as date,
            'ngos' as type,
            COUNT(*) as count
          FROM ngos 
          WHERE created_at >= COALESCE($1, '1900-01-01') AND created_at <= COALESCE($2, NOW())
          GROUP BY DATE_TRUNC('day', created_at)
          UNION ALL
          SELECT 
            DATE_TRUNC('day', created_at) as date,
            'buyers' as type,
            COUNT(*) as count
          FROM buyers 
          WHERE created_at >= COALESCE($1, '1900-01-01') AND created_at <= COALESCE($2, NOW())
          GROUP BY DATE_TRUNC('day', created_at)
          ORDER BY date DESC
        `;
        params = [startDate || null, endDate || null];
        break;

      case "projects":
        query = `
          SELECT 
            DATE_TRUNC('day', created_at) as date,
            status,
            COUNT(*) as count
          FROM projects 
          WHERE created_at >= COALESCE($1, '1900-01-01') AND created_at <= COALESCE($2, NOW())
          GROUP BY DATE_TRUNC('day', created_at), status
          ORDER BY date DESC
        `;
        params = [startDate || null, endDate || null];
        break;

      default:
        return res.status(400).json({
          error:
            "Invalid report type. Available types: registrations, projects",
        });
    }

    const result = await pool.query(query, params);

    res.json({
      reportType: type,
      data: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
