import apiClient from "./config";

// NGO Authentication APIs
export const ngoAuth = {
  // Register new NGO
  register: async (ngoData) => {
    try {
      const response = await apiClient.post("/api/auth/ngo/register", ngoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // NGO Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/api/auth/ngo/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get NGO profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/auth/ngo/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update NGO profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(
        "/api/auth/ngo/profile",
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Buyer Authentication APIs
export const buyerAuth = {
  // Register new Buyer
  register: async (buyerData) => {
    try {
      const response = await apiClient.post(
        "/api/auth/buyer/register",
        buyerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buyer Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post(
        "/api/auth/buyer/login",
        credentials
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Buyer profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/auth/buyer/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Buyer profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(
        "/api/auth/buyer/profile",
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Panchayat Authentication APIs
export const panchayatAuth = {
  // Register new Panchayat
  register: async (panchayatData) => {
    try {
      const response = await apiClient.post(
        "/api/auth/panchayat/register",
        panchayatData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Panchayat Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post(
        "/api/auth/panchayat/login",
        credentials
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Panchayat profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/auth/panchayat/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Panchayat profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(
        "/api/auth/panchayat/profile",
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Community Authentication APIs
export const communityAuth = {
  // Register new Community
  register: async (communityData) => {
    try {
      const response = await apiClient.post(
        "/api/auth/community/register",
        communityData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Community Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post(
        "/api/auth/community/login",
        credentials
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Community profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/auth/community/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Community profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(
        "/api/auth/community/profile",
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Common authentication utilities
export const authUtils = {
  // Store auth data in localStorage
  setAuthData: (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
  },

  // Get auth data from localStorage
  getAuthData: () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    return {
      token,
      user: userData ? JSON.parse(userData) : null,
    };
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  },
};
