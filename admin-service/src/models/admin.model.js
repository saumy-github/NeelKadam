// Admin Model - Database operations
import pool from "../config/database.config.js";

// Get all NGOs with optional filters
export const getAllNGOs = async (filters = {}) => {
  const { verified, search } = filters;

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

  const result = await pool.query(query, params);
  return result.rows;
};

// Get all buyers with optional filters
export const getAllBuyers = async (filters = {}) => {
  const { verified, search } = filters;

  let query =
    "SELECT buyer_id, company_name, email, pan_no, account_holder_name, is_verified, created_at FROM buyer WHERE 1=1";
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

  const result = await pool.query(query, params);
  return result.rows;
};

// Get all projects with optional filters
export const getAllProjects = async (filters = {}) => {
  const { status, seller_type, location } = filters;

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

  const result = await pool.query(query, params);
  return result.rows;
};

// Update NGO verification status
export const updateNGOVerification = async (ngoId, verified) => {
  const result = await pool.query(
    "UPDATE ngo SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE ngo_id = $2 RETURNING ngo_id, ngo_name, email, is_verified",
    [verified, ngoId]
  );

  return result.rows[0] || null;
};

// Update buyer verification status
export const updateBuyerVerification = async (buyerId, verified) => {
  const result = await pool.query(
    "UPDATE buyer SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE buyer_id = $2 RETURNING buyer_id, company_name, email, is_verified",
    [verified, buyerId]
  );

  return result.rows[0] || null;
};

// Get project with seller wallet address
export const getProjectWithWallet = async (projectId) => {
  const result = await pool.query(
    "SELECT p.*, n.wallet_address AS seller_wallet_address " +
      "FROM project p " +
      "LEFT JOIN ngo n ON p.seller_id = n.ngo_id AND p.seller_type = 'ngo' " +
      "WHERE p.project_id = $1",
    [projectId]
  );

  return result.rows[0] || null;
};

// Update project status and carbon credits
export const updateProjectStatus = async (
  projectId,
  status,
  actualCC = null
) => {
  let query;
  let params;

  if (actualCC !== null) {
    query =
      "UPDATE project SET status = $1, actual_cc = $2, updated_at = CURRENT_TIMESTAMP WHERE project_id = $3 RETURNING project_id, plantation_area, status, actual_cc";
    params = [status, actualCC, projectId];
  } else {
    query =
      "UPDATE project SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE project_id = $2 RETURNING project_id, plantation_area, status";
    params = [status, projectId];
  }

  const result = await pool.query(query, params);
  return result.rows[0] || null;
};

// Update seller's total carbon credits
export const updateSellerTotalCC = async (sellerType, sellerId, ccAmount) => {
  if (sellerType !== "ngo") {
    throw new Error("Only NGO seller type is supported");
  }

  await pool.query(
    "UPDATE ngo SET total_cc = total_cc + $1 WHERE ngo_id = $2",
    [ccAmount, sellerId]
  );
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const [ngosResult, buyersResult, projectsResult] = await Promise.all([
    pool.query(
      "SELECT COUNT(*) as total, COUNT(CASE WHEN is_verified = true THEN 1 END) as verified FROM ngo"
    ),
    pool.query(
      "SELECT COUNT(*) as total, COUNT(CASE WHEN is_verified = true THEN 1 END) as verified FROM buyer"
    ),
    pool.query(
      "SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved, COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending FROM project"
    ),
  ]);

  return {
    ngos: {
      total: parseInt(ngosResult.rows[0].total),
      verified: parseInt(ngosResult.rows[0].verified),
    },
    buyers: {
      total: parseInt(buyersResult.rows[0].total),
      verified: parseInt(buyersResult.rows[0].verified),
    },
    projects: {
      total: parseInt(projectsResult.rows[0].total),
      approved: parseInt(projectsResult.rows[0].approved),
      pending: parseInt(projectsResult.rows[0].pending),
    },
  };
};

// Get reports by type
export const getReportsByType = async (
  type,
  startDate = null,
  endDate = null
) => {
  let query;
  const params = [startDate || null, endDate || null];

  switch (type) {
    case "registrations":
      query = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          'ngos' as type,
          COUNT(*) as count
        FROM ngo 
        WHERE created_at >= COALESCE($1, '1900-01-01') AND created_at <= COALESCE($2, NOW())
        GROUP BY DATE_TRUNC('day', created_at)
        UNION ALL
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          'buyers' as type,
          COUNT(*) as count
        FROM buyer 
        WHERE created_at >= COALESCE($1, '1900-01-01') AND created_at <= COALESCE($2, NOW())
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      break;

    case "projects":
      query = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          status,
          COUNT(*) as count
        FROM project 
        WHERE created_at >= COALESCE($1, '1900-01-01') AND created_at <= COALESCE($2, NOW())
        GROUP BY DATE_TRUNC('day', created_at), status
        ORDER BY date DESC
      `;
      break;

    default:
      throw new Error("Invalid report type");
  }

  const result = await pool.query(query, params);
  return result.rows;
};

// Get all projects with seller names
export const getAllProjectsWithSellerNames = async () => {
  const query = `
    SELECT 
      p.*,
      n.ngo_name AS seller_name
    FROM 
      project p
    LEFT JOIN 
      ngo n ON p.seller_id = n.ngo_id AND p.seller_type = 'ngo'
    ORDER BY 
      p.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};
