/**
 * Main Router Configuration
 *
 * This file aggregates all route modules and exports a single router
 * that can be imported by app.js for cleaner route management.
 */

import express from "express";
import ngoAuthRoutes from "./auth/ngo.js";
import buyerAuthRoutes from "./auth/buyer.js";
import projectRoutes from "./projects.js";
import buyerRoutes from "./buyer.js";
import dashboardRoutes from "./dashboard.js";
import transferRoutes from "./transfer.js";

const router = express.Router();

// Mount all routes
router.use("/auth/ngo", ngoAuthRoutes);
router.use("/auth/buyer", buyerAuthRoutes);
router.use("/projects", projectRoutes);
router.use("/buyer", buyerRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/transfer", transferRoutes);

export default router;
