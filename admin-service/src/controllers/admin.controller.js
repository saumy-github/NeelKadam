// Admin Controller - HTTP request/response handlers
import * as AdminService from "../services/admin.service.js";

// POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AdminService.adminLoginService(email, password);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

// GET /api/admin/ngos
export const getAllNGOs = async (req, res) => {
  try {
    const { verified, search } = req.query;
    const result = await AdminService.getAllNGOsService({ verified, search });
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// GET /api/admin/buyers
export const getAllBuyers = async (req, res) => {
  try {
    const { verified, search } = req.query;
    const result = await AdminService.getAllBuyersService({ verified, search });
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// GET /api/admin/projects
export const getAllProjects = async (req, res) => {
  try {
    const { status, seller_type, location } = req.query;
    const result = await AdminService.getAllProjectsService({
      status,
      seller_type,
      location,
    });
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// GET /api/admin/transactions
export const getAllTransactions = async (req, res) => {
  try {
    const result = await AdminService.getAllTransactionsService();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// PATCH /api/admin/ngos/:id/verify
export const verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const result = await AdminService.verifyNGOService(id, verified);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    if (error.message === "NGO not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: "Server error",
    });
  }
};

// PATCH /api/admin/buyers/:id/verify
export const verifyBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const result = await AdminService.verifyBuyerService(id, verified);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    if (error.message === "Buyer not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: "Server error",
    });
  }
};

// PATCH /api/admin/projects/:id/approve
export const approveProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const result = await AdminService.approveProjectService(id, approved);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    if (error.message === "Project not found") {
      return res.status(404).json({ error: error.message });
    }
    if (
      error.message === "Seller has no wallet address registered" ||
      error.message === "Invalid tree count for carbon credit calculation"
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const result = await AdminService.getDashboardStatsService();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// GET /api/admin/reports/:type
export const getReports = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    // Validate report type
    if (!["registrations", "projects"].includes(type)) {
      return res.status(400).json({
        error: "Invalid report type. Available types: registrations, projects",
      });
    }

    const result = await AdminService.getReportsService(
      type,
      startDate,
      endDate
    );
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// GET /projects - Protected route with seller names
export const getAllProjectsWithSellerNames = async (req, res) => {
  try {
    const result = await AdminService.getAllProjectsWithSellerNamesService();
    res.json(result);
  } catch (error) {
    console.error("Error fetching projects for verification:", error.message);
    res.status(500).json({
      error: "Server error fetching projects for verification",
    });
  }
};
