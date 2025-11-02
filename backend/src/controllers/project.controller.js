/**
 * Project Controller
 * Handles HTTP requests and responses for project operations
 */

import {
  createProjectService,
  submitProjectService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  getProjectsBySellerService,
  updateProjectStatusService,
  uploadProjectPhotosService,
} from "../services/project.service.js";

/**
 * Create new project (authenticated)
 * POST /api/projects
 */
export const createProject = async (req, res) => {
  try {
    const seller_id = req.user.seller_id;
    const seller_type = req.user.seller_type;

    const result = await createProjectService(seller_id, seller_type, req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * Submit new project (authenticated)
 * POST /api/projects/submit
 */
export const submitProject = async (req, res) => {
  try {
    const seller_id = req.user.seller_id;
    const seller_type = req.user.seller_type;

    const result = await submitProjectService(seller_id, seller_type, req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error submitting project:", error.message);

    if (error.message === "All project fields are required") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Server error while submitting project" });
  }
};

/**
 * Get all projects with optional filters
 * GET /api/projects
 */
export const getAllProjects = async (req, res) => {
  try {
    const result = await getAllProjectsService(req.query);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * Get project by ID
 * GET /api/projects/:id
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProjectByIdService(id);
    res.json(result);
  } catch (error) {
    console.error(error.message);

    if (error.message === "Project not found") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * Update project
 * PUT /api/projects/:id
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateProjectService(id, req.body);
    res.json(result);
  } catch (error) {
    console.error(error.message);

    if (error.message === "Project not found") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * Delete project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProjectService(id);
    res.json(result);
  } catch (error) {
    console.error(error.message);

    if (error.message === "Project not found") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * Get projects by seller
 * GET /api/projects/seller/:sellerId
 */
export const getProjectsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { seller_type } = req.query;

    const result = await getProjectsBySellerService(sellerId, seller_type);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * Update project status
 * PATCH /api/projects/:id/status
 */
export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await updateProjectStatusService(id, status);
    res.json(result);
  } catch (error) {
    console.error(error.message);

    if (error.message.includes("Invalid status")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.message === "Project not found") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Server error",
    });
  }
};

/**
 * Upload project photos
 * POST /api/projects/:id/photos
 */
export const uploadProjectPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const { photos } = req.body;

    const result = await uploadProjectPhotosService(id, photos);
    res.json(result);
  } catch (error) {
    console.error(error.message);

    if (error.message === "Photos array is required") {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.message === "Project not found") {
      return res.status(404).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Server error",
    });
  }
};
