// Admin management routes
import express from "express";
import * as AdminController from "../controllers/admin.controller.js";

const router = express.Router();

// POST /api/admin/login - Admin Login (placeholder - you'll need to create admin table)
router.post("/login", AdminController.adminLogin);

// GET /api/admin/ngos - Get all NGOs
router.get("/ngos", AdminController.getAllNGOs);

// GET /api/admin/buyers - Get all Buyers
router.get("/buyers", AdminController.getAllBuyers);

// GET /api/admin/projects - Get all Projects
router.get("/projects", AdminController.getAllProjects);

// GET /api/admin/transactions - Get all Transactions (placeholder)
router.get("/transactions", AdminController.getAllTransactions);

// PATCH /api/admin/ngos/:id/verify - Verify NGO
router.patch("/ngos/:id/verify", AdminController.verifyNGO);

// PATCH /api/admin/buyers/:id/verify - Verify Buyer
router.patch("/buyers/:id/verify", AdminController.verifyBuyer);

// PATCH /api/admin/projects/:id/approve - Approve Project
router.patch("/projects/:id/approve", AdminController.approveProject);

// GET /api/admin/dashboard/stats - Get Dashboard Statistics
router.get("/dashboard/stats", AdminController.getDashboardStats);

// GET /api/admin/reports/:type - Get Reports
router.get("/reports/:type", AdminController.getReports);

export default router;
