/**
 * Project Management Routes
 *
 * This file contains all project-related endpoints, including:
 * - Creating and submitting projects
 * - Retrieving project data (all, by ID, by seller)
 * - Updating and deleting projects
 * - Managing project status
 * - Uploading project photos
 *
 * Protected routes require JWT authentication.
 */

import express from "express";
import { authMiddleware } from "../middleware/index.middleware.js";
import {
  createProject,
  submitProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsBySeller,
  updateProjectStatus,
  uploadProjectPhotos,
} from "../controllers/project.controller.js";

const router = express.Router();

// POST /api/projects - Create new project with authentication
router.post("/", authMiddleware, createProject);

// POST /api/projects/submit - Protected route for logged-in NGOs to submit projects
router.post("/submit", authMiddleware, submitProject);

// GET /api/projects - Get all projects
router.get("/", getAllProjects);

// GET /api/projects/seller/:sellerId - Get projects by seller
router.get("/seller/:sellerId", getProjectsBySeller);

// GET /api/projects/:id - Get project by ID
router.get("/:id", getProjectById);

// PUT /api/projects/:id - Update project
router.put("/:id", updateProject);

// DELETE /api/projects/:id - Delete project
router.delete("/:id", deleteProject);

// PATCH /api/projects/:id/status - Update project status
router.patch("/:id/status", updateProjectStatus);

// POST /api/projects/:id/photos - Upload project photos
router.post("/:id/photos", uploadProjectPhotos);

export default router;
