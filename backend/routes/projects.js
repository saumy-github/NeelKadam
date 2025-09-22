// Project management routes
const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// Authentication middleware
const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ error: "Invalid token." });
  }
};

// POST /api/projects - Create new project with authentication
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Extract user info from JWT token payload (added by auth middleware)
    const seller_id = req.user.seller_id;
    const seller_type = req.user.seller_type; // Get the seller type from the JWT token

    const {
      plantation_area,
      location,
      tree_type,
      tree_no,
      plantation_period,
      estimated_cc,
    } = req.body;

    const newProject = await pool.query(
      `INSERT INTO project (seller_id, seller_type, plantation_area, location, tree_type, tree_no, plantation_period, estimated_cc, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING *`,
      [
        seller_id,
        seller_type,
        plantation_area,
        location,
        tree_type,
        tree_no,
        plantation_period,
        estimated_cc,
      ]
    );

    res.status(201).json({
      message: "Project created successfully",
      project: newProject.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// POST /api/projects/submit - Protected route for logged-in NGOs to submit projects
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    // Extract user info from JWT token payload (added by auth middleware)
    const seller_id = req.user.seller_id;
    const seller_type = req.user.seller_type; // Get the seller type from the JWT token

    // Extract project data from request body
    const {
      plantation_area,
      location,
      tree_type,
      tree_no,
      plantation_period,
      estimated_cc,
    } = req.body;

    // Validate required fields
    if (
      !plantation_area ||
      !location ||
      !tree_type ||
      !tree_no ||
      !plantation_period ||
      !estimated_cc
    ) {
      return res.status(400).json({ error: "All project fields are required" });
    }

    // Insert new project into database
    const newProject = await pool.query(
      `INSERT INTO project (
        seller_id, 
        seller_type, 
        plantation_area, 
        location, 
        tree_type, 
        tree_no, 
        plantation_period, 
        estimated_cc, 
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING *`,
      [
        seller_id,
        seller_type,
        plantation_area,
        location,
        tree_type,
        tree_no,
        plantation_period,
        estimated_cc,
      ]
    );

    // Return success response with created project
    res.status(201).json({
      message: "Project submitted successfully",
      project: newProject.rows[0],
    });
  } catch (error) {
    console.error("Error submitting project:", error.message);
    res.status(500).json({ error: "Server error while submitting project" });
  }
});

// GET /api/projects - Get all projects
router.get("/", async (req, res) => {
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

// GET /api/projects/:id - Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await pool.query(
      "SELECT * FROM project WHERE project_id = $1",
      [id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json({
      project: project.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// PUT /api/projects/:id - Update project
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [id, ...Object.values(updateData)];

    const updatedProject = await pool.query(
      `UPDATE project SET ${setClause} WHERE project_id = $1 RETURNING *`,
      values
    );

    if (updatedProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json({
      message: "Project updated successfully",
      project: updatedProject.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await pool.query(
      "DELETE FROM project WHERE project_id = $1 RETURNING *",
      [id]
    );

    if (deletedProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// GET /api/projects/seller/:sellerId - Get projects by seller
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { seller_type } = req.query;

    let query = "SELECT * FROM project WHERE seller_id = $1";
    let params = [sellerId];

    if (seller_type) {
      query += " AND seller_type = $2";
      params.push(seller_type);
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

// PATCH /api/projects/:id/status - Update project status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !status ||
      !["pending", "approved", "rejected", "completed"].includes(status)
    ) {
      return res.status(400).json({
        error:
          "Invalid status. Must be: pending, approved, rejected, or completed",
      });
    }

    const updatedProject = await pool.query(
      "UPDATE project SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE project_id = $2 RETURNING *",
      [status, id]
    );

    if (updatedProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json({
      message: "Project status updated successfully",
      project: updatedProject.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// POST /api/projects/:id/photos - Upload project photos
router.post("/:id/photos", async (req, res) => {
  try {
    const { id } = req.params;
    const { photos } = req.body; // Array of photo URLs/paths

    if (!photos || !Array.isArray(photos)) {
      return res.status(400).json({
        error: "Photos array is required",
      });
    }

    // For now, just store the photo URLs in the project description or create a separate photos table
    const updatedProject = await pool.query(
      "UPDATE project SET photos = $1, updated_at = CURRENT_TIMESTAMP WHERE project_id = $2 RETURNING *",
      [JSON.stringify(photos), id]
    );

    if (updatedProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json({
      message: "Photos uploaded successfully",
      project: updatedProject.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
