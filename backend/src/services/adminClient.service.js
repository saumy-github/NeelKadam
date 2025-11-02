// HTTP client for admin microservice
import axios from "axios";
import adminServiceConfig from "../config/adminMS.config.js";

const adminApi = axios.create({
  baseURL: adminServiceConfig.serviceUrl,
  timeout: adminServiceConfig.timeout,
  headers: adminServiceConfig.headers,
});

// Admin login
async function adminLogin(email, password) {
  try {
    const response = await adminApi.post("/api/admin/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to login";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Get all NGOs with optional filters
async function getAllNGOs(filters = {}) {
  try {
    const response = await adminApi.get("/api/admin/ngos", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to get NGOs";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Get all buyers with optional filters
async function getAllBuyers(filters = {}) {
  try {
    const response = await adminApi.get("/api/admin/buyers", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to get buyers";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Get all projects with optional filters
async function getAllProjects(filters = {}) {
  try {
    const response = await adminApi.get("/api/admin/projects", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to get projects";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Get all transactions
async function getAllTransactions() {
  try {
    const response = await adminApi.get("/api/admin/transactions");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to get transactions";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Verify NGO
async function verifyNGO(ngoId, verified) {
  try {
    const response = await adminApi.patch(`/api/admin/ngos/${ngoId}/verify`, {
      verified,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to verify NGO";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Verify buyer
async function verifyBuyer(buyerId, verified) {
  try {
    const response = await adminApi.patch(
      `/api/admin/buyers/${buyerId}/verify`,
      { verified }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to verify buyer";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Approve project
async function approveProject(projectId, approved) {
  try {
    const response = await adminApi.patch(
      `/api/admin/projects/${projectId}/approve`,
      { approved }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to approve project";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Get dashboard statistics
async function getDashboardStats() {
  try {
    const response = await adminApi.get("/api/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to get dashboard stats";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Get reports by type
async function getReports(type, startDate = null, endDate = null) {
  try {
    const response = await adminApi.get(`/api/admin/reports/${type}`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to get reports";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

// Warm up admin service (health check)
async function warmupAdminService() {
  try {
    const response = await adminApi.get("/health");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Admin service unavailable";
    throw new Error(`Admin service error: ${errorMessage}`);
  }
}

export {
  adminLogin,
  getAllNGOs,
  getAllBuyers,
  getAllProjects,
  getAllTransactions,
  verifyNGO,
  verifyBuyer,
  approveProject,
  getDashboardStats,
  getReports,
  warmupAdminService,
};
