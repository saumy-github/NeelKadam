// Admin proxy routes - forwards all admin requests to admin microservice
import express from "express";
import * as adminClient from "../services/adminClient.service.js";

const router = express.Router();

// POST /api/admin/login - Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminClient.adminLogin(email, password);
    res.json(result);
  } catch (error) {
    console.error("Admin login proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// GET /api/admin/ngos - Get all NGOs
router.get("/ngos", async (req, res) => {
  try {
    const result = await adminClient.getAllNGOs(req.query);
    res.json(result);
  } catch (error) {
    console.error("Get NGOs proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// GET /api/admin/buyers - Get all Buyers
router.get("/buyers", async (req, res) => {
  try {
    const result = await adminClient.getAllBuyers(req.query);
    res.json(result);
  } catch (error) {
    console.error("Get buyers proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// GET /api/admin/projects - Get all Projects
router.get("/projects", async (req, res) => {
  try {
    const result = await adminClient.getAllProjects(req.query);
    res.json(result);
  } catch (error) {
    console.error("Get projects proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// GET /api/admin/transactions - Get all Transactions
router.get("/transactions", async (req, res) => {
  try {
    const result = await adminClient.getAllTransactions();
    res.json(result);
  } catch (error) {
    console.error("Get transactions proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// PATCH /api/admin/ngos/:id/verify - Verify NGO
router.patch("/ngos/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const result = await adminClient.verifyNGO(id, verified);
    res.json(result);
  } catch (error) {
    console.error("Verify NGO proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// PATCH /api/admin/buyers/:id/verify - Verify Buyer
router.patch("/buyers/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const result = await adminClient.verifyBuyer(id, verified);
    res.json(result);
  } catch (error) {
    console.error("Verify buyer proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// PATCH /api/admin/projects/:id/approve - Approve Project
router.patch("/projects/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const result = await adminClient.approveProject(id, approved);
    res.json(result);
  } catch (error) {
    console.error("Approve project proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// GET /api/admin/dashboard/stats - Get Dashboard Statistics
router.get("/dashboard/stats", async (req, res) => {
  try {
    const result = await adminClient.getDashboardStats();
    res.json(result);
  } catch (error) {
    console.error("Get dashboard stats proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

// GET /api/admin/reports/:type - Get Reports
router.get("/reports/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    const result = await adminClient.getReports(type, startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error("Get reports proxy error:", error.message);
    res.status(503).json({
      error: "Admin service unavailable",
      details: error.message,
    });
  }
});

export default router;
