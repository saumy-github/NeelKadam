import apiClient from "./config";

// Admin Management APIs
export const adminApi = {
  // Admin Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/api/admin/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all NGOs
  getAllNGOs: async (filters = {}) => {
    try {
      const response = await apiClient.get("/api/admin/ngos", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Buyers
  getAllBuyers: async (filters = {}) => {
    try {
      const response = await apiClient.get("/api/admin/buyers", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Projects
  getAllProjects: async () => {
    try {
      const response = await apiClient.get("/api/admin/projects");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Panchayats
  getAllPanchayats: async (filters = {}) => {
    try {
      const response = await apiClient.get("/api/admin/panchayats", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Communities
  getAllCommunities: async (filters = {}) => {
    try {
      const response = await apiClient.get("/api/admin/communities", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Projects
  getAllProjects: async (filters = {}) => {
    try {
      const response = await apiClient.get("/api/admin/projects", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Transactions
  getAllTransactions: async (filters = {}) => {
    try {
      const response = await apiClient.get("/api/admin/transactions", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify NGO
  verifyNGO: async (ngoId, verified) => {
    try {
      const response = await apiClient.patch("/api/admin/ngos/${ngoId}/verify", {
        verified,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify Buyer
  verifyBuyer: async (buyerId, verified) => {
    try {
      const response = await apiClient.patch(
        "/api/admin/buyers/${buyerId}/verify",
        { verified }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify Panchayat
  verifyPanchayat: async (panchayatId, verified) => {
    try {
      const response = await apiClient.patch(
        "/api/admin/panchayats/${panchayatId}/verify",
        { verified }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify Community
  verifyCommunity: async (communityId, verified) => {
    try {
      const response = await apiClient.patch(
        "/api/admin/communities/${communityId}/verify",
        { verified }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve/Reject Project
  approveProject: async (projectId, approved) => {
    try {
      const response = await apiClient.patch(
        "/api/admin/projects/${projectId}/approve",
        { approved }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/api/admin/dashboard/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Reports
  getReports: async (reportType, filters = {}) => {
    try {
      const response = await apiClient.get("/api/admin/reports/${reportType}", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
