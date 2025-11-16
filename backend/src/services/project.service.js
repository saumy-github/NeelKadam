// Project service - business logic for project operations

import * as ProjectModel from "../models/project.model.js";

// Create new project service
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

// Submit new project service
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

// Get all projects with filters
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

// Get project by ID
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

// Update project
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

// Delete project
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

// Get projects by seller
export const getProjectsBySellerService = async (sellerId, sellerType) => {
  // Get projects using model
  const projects = await ProjectModel.getProjectsByUserId(sellerId, sellerType);

  return {
    projects,
  };
};

// Update project status
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

// Upload project photos
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
