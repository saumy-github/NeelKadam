/**
 * Main Router Configuration
 *
 * This file aggregates all route modules and exports a single router
 * that can be imported by app.js for cleaner route management.
 */

import express from "express";
import ngoAuthRoutes from "./auth/ngo.routes.js";
import buyerAuthRoutes from "./auth/buyer.routes.js";
import projectRoutes from "./projects.routes.js";
import buyerRoutes from "./buyer.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import transferRoutes from "./transfer.routes.js";

const router = express.Router();

// Mount all routes
router.use("/auth/ngo", ngoAuthRoutes);
router.use("/auth/buyer", buyerAuthRoutes);
router.use("/projects", projectRoutes);
router.use("/buyer", buyerRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/transfer", transferRoutes);

export default router;
