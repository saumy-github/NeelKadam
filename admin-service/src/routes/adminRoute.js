// Admin protected routes
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import * as AdminController from "../controllers/admin.controller.js";

const router = express.Router();

// GET /projects - Get all projects for verification with seller name
// Protected route - requires authentication
router.get(
  "/projects",
  authMiddleware,
  AdminController.getAllProjectsWithSellerNames
);

export default router;
