/**
 * Project Service
 * Handles business logic for project operations
 */

import * as ProjectModel from "../models/project.model.js";

/**
 * Create new project service
 * @param {string} seller_id - Seller ID from JWT
 * @param {string} seller_type - Seller type from JWT
 * @param {Object} projectData - Project data
 * @returns {Object} - Created project
 */
export const createProjectService = async (
  seller_id,
  seller_type,
  projectData
) => {
  const {
    plantation_area,
    location,
    tree_type,
    tree_no,
    plantation_period,
    estimated_cc,
  } = projectData;

  // Create project using model
  const newProject = await ProjectModel.createProject({
    seller_id,
    seller_type,
    plantation_area,
    location,
    tree_type,
    tree_no,
    plantation_period,
    estimated_cc,
    status: "pending",
  });

  return {
    message: "Project created successfully",
    project: newProject,
  };
};

/**
 * Submit new project service
 * @param {string} seller_id - Seller ID from JWT
 * @param {string} seller_type - Seller type from JWT
 * @param {Object} projectData - Project data
 * @returns {Object} - Submitted project
 */
export const submitProjectService = async (
  seller_id,
  seller_type,
  projectData
) => {
  const {
    plantation_area,
    location,
    tree_type,
    tree_no,
    plantation_period,
    estimated_cc,
  } = projectData;

  // Validate required fields
  if (
    !plantation_area ||
    !location ||
    !tree_type ||
    !tree_no ||
    !plantation_period ||
    !estimated_cc
  ) {
    throw new Error("All project fields are required");
  }

  // Create project using model
  const newProject = await ProjectModel.createProject({
    seller_id,
    seller_type,
    plantation_area,
    location,
    tree_type,
    tree_no,
    plantation_period,
    estimated_cc,
    status: "pending",
  });

  return {
    message: "Project submitted successfully",
    project: newProject,
  };
};

/**
 * Get all projects with filters
 * @param {Object} filters - Query filters (status, seller_type, location)
 * @returns {Object} - List of projects
 */
export const getAllProjectsService = async (filters) => {
  const { status, seller_type, location } = filters;

  // Get projects using model
  const projects = await ProjectModel.getAllProjects({
    status,
    seller_type,
    location,
  });

  return {
    projects,
  };
};

/**
 * Get project by ID
 * @param {string} id - Project ID
 * @returns {Object} - Project data
 */
export const getProjectByIdService = async (id) => {
  // Get project using model
  const project = await ProjectModel.getProjectById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return {
    project,
  };
};

/**
 * Update project
 * @param {string} id - Project ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated project
 */
export const updateProjectService = async (id, updateData) => {
  // Update project using model
  const updatedProject = await ProjectModel.updateProject(id, updateData);

  if (!updatedProject) {
    throw new Error("Project not found");
  }

  return {
    message: "Project updated successfully",
    project: updatedProject,
  };
};

/**
 * Delete project
 * @param {string} id - Project ID
 * @returns {Object} - Success message
 */
export const deleteProjectService = async (id) => {
  // Delete project using model
  const deletedProject = await ProjectModel.deleteProject(id);

  if (!deletedProject) {
    throw new Error("Project not found");
  }

  return {
    message: "Project deleted successfully",
  };
};

/**
 * Get projects by seller
 * @param {string} sellerId - Seller ID
 * @param {string} sellerType - Seller type (optional)
 * @returns {Object} - List of projects
 */
export const getProjectsBySellerService = async (sellerId, sellerType) => {
  // Get projects using model
  const projects = await ProjectModel.getProjectsByUserId(sellerId, sellerType);

  return {
    projects,
  };
};

/**
 * Update project status
 * @param {string} id - Project ID
 * @param {string} status - New status
 * @returns {Object} - Updated project
 */
export const updateProjectStatusService = async (id, status) => {
  if (
    !status ||
    !["pending", "approved", "rejected", "completed"].includes(status)
  ) {
    throw new Error(
      "Invalid status. Must be: pending, approved, rejected, or completed"
    );
  }

  // Update project status using model
  const updatedProject = await ProjectModel.updateProjectStatus(id, status);

  if (!updatedProject) {
    throw new Error("Project not found");
  }

  return {
    message: "Project status updated successfully",
    project: updatedProject,
  };
};

/**
 * Upload project photos
 * @param {string} id - Project ID
 * @param {Array} photos - Array of photo URLs
 * @returns {Object} - Updated project
 */
export const uploadProjectPhotosService = async (id, photos) => {
  if (!photos || !Array.isArray(photos)) {
    throw new Error("Photos array is required");
  }

  // Update project photos using model
  const updatedProject = await ProjectModel.updateProject(id, {
    photos: JSON.stringify(photos),
  });

  if (!updatedProject) {
    throw new Error("Project not found");
  }

  return {
    message: "Photos uploaded successfully",
    project: updatedProject,
  };
};
