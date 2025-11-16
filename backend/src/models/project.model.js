// Project model - database operations for the `project` table

import pool from "../config/database.config.js";

// Create a new project
export const createProject = async (projectData) => {
  const {
    seller_id,
    seller_type,
    plantation_area,
    location,
    tree_type,
    tree_no,
    plantation_period,
    estimated_cc,
    status = "pending",
  } = projectData;

  const result = await pool.query(
    `INSERT INTO project (
      seller_id, seller_type, plantation_area, location, tree_type, 
      tree_no, plantation_period, estimated_cc, status, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
    RETURNING *`,
    [
      seller_id,
      seller_type,
      plantation_area,
      location,
      tree_type,
      tree_no,
      plantation_period,
      estimated_cc,
      status,
    ]
  );

  return result.rows[0];
};

// Get all projects with optional filters
export const getAllProjects = async (filters = {}) => {
  const { status, seller_type, location } = filters;

  let query = "SELECT * FROM project WHERE 1=1";
  const params = [];
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

  const result = await pool.query(query, params);

  return result.rows;
};

// Get project by ID
export const getProjectById = async (projectId) => {
  const result = await pool.query(
    "SELECT * FROM project WHERE project_id = $1",
    [projectId]
  );

  return result.rows[0] || null;
};

// Get projects by user (seller) ID
export const getProjectsByUserId = async (sellerId, sellerType = null) => {
  let query = "SELECT * FROM project WHERE seller_id = $1";
  const params = [sellerId];

  if (sellerType) {
    query += " AND seller_type = $2";
    params.push(sellerType);
  }

  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, params);

  return result.rows;
};

// Update project (partial updates supported)
export const updateProject = async (projectId, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) {
    return null;
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");

  const result = await pool.query(
    `UPDATE project 
     SET ${setClause}, updated_at = NOW() 
     WHERE project_id = $1 
     RETURNING *`,
    [projectId, ...values]
  );

  return result.rows[0] || null;
};

// Update project status
export const updateProjectStatus = async (projectId, status) => {
  const result = await pool.query(
    `UPDATE project 
     SET status = $1, updated_at = NOW() 
     WHERE project_id = $2 
     RETURNING *`,
    [status, projectId]
  );

  return result.rows[0] || null;
};

// Delete project
export const deleteProject = async (projectId) => {
  const result = await pool.query(
    "DELETE FROM project WHERE project_id = $1 RETURNING *",
    [projectId]
  );

  return result.rows[0] || null;
};
