/**
 * Dashboard Service
 * Handles business logic for dashboard operations
 */

import * as SellerModel from "../models/seller.model.js";
import * as ProjectModel from "../models/project.model.js";

/**
 * Get NGO dashboard data service
 * @param {string} ngoId - NGO ID from JWT
 * @returns {Object} - Dashboard data with profile, stats, and recent activity
 */
export const getNgoDashboardService = async (ngoId) => {
  if (!ngoId) {
    throw new Error("Invalid user credentials");
  }

  // Fetch NGO profile using model
  const ngoProfile = await SellerModel.getSellerById(ngoId);

  if (!ngoProfile) {
    throw new Error("NGO profile not found");
  }

  // Extract relevant profile fields
  const profileData = {
    ngo_id: ngoProfile.ngo_id,
    ngo_name: ngoProfile.ngo_name,
    email: ngoProfile.email,
    license_no: ngoProfile.license_no,
    spokesperson_name: ngoProfile.spokesperson_name,
    pan_no: ngoProfile.pan_no,
    created_at: ngoProfile.created_at,
  };

  // Fetch all projects for this NGO using model
  const projects = await ProjectModel.getProjectsByUserId(ngoId, "ngo");

  // Calculate summary statistics
  const totalProjects = projects.length;
  const pendingProjects = projects.filter((p) => p.status === "pending").length;

  // Use total_cc from NGO profile (includes transfers and minting)
  const totalCarbonCredits = ngoProfile.total_cc || 0;

  // Get 5 most recent projects for activity feed
  const recentProjects = projects.slice(0, 5).map((p) => ({
    project_id: p.project_id,
    location: p.location,
    status: p.status,
    tree_type: p.tree_type,
    estimated_cc: p.estimated_cc,
    created_at: p.created_at,
  }));

  return {
    success: true,
    dashboard: {
      profile: profileData,
      stats: {
        total_projects: totalProjects,
        pending_projects: pendingProjects,
        total_carbon_credits: totalCarbonCredits, // Changed from minted_carbon_credits
      },
      recent_activity: recentProjects,
    },
  };
};
