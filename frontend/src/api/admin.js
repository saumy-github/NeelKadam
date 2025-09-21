import apiClient from "./config";

// Admin Management APIs
export const adminApi = {
  // Admin Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/admin/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all NGOs
  getAllNGOs: async (filters = {}) => {
    try {
      const response = await apiClient.get("/admin/ngos", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Buyers
  getAllBuyers: async (filters = {}) => {
    try {
      const response = await apiClient.get("/admin/buyers", {
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
      const response = await apiClient.get("/admin/projects");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all Panchayats
  getAllPanchayats: async (filters = {}) => {
    try {
      const response = await apiClient.get("/admin/panchayats", {
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
      const response = await apiClient.get("/admin/communities", {
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
      const response = await apiClient.get("/admin/projects", {
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
      const response = await apiClient.get("/admin/transactions", {
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
      const response = await apiClient.patch(`/admin/ngos/${ngoId}/verify`, {
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
        `/admin/buyers/${buyerId}/verify`,
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
        `/admin/panchayats/${panchayatId}/verify`,
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
        `/admin/communities/${communityId}/verify`,
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
        `/admin/projects/${projectId}/approve`,
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
      const response = await apiClient.get("/admin/dashboard/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Reports
  getReports: async (reportType, filters = {}) => {
    try {
      const response = await apiClient.get(`/admin/reports/${reportType}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
