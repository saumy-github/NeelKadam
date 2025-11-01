// Main Router Configuration - Aggregates all route modules
import express from "express";
import adminRoutes from "./admin.js";
import adminRoute from "./adminRoute.js";

const router = express.Router();

// Mount all routes
router.use("/admin", adminRoutes);
router.use("/admin", adminRoute);

export default router;
