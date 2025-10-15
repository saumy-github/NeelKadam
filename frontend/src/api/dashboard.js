import apiClient from "./config";

// Simple cache implementation to reduce API calls
const cache = {
  data: {},
  timestamp: {},
  maxAge: 60000, // 1 minute cache

  get(key) {
    const now = Date.now();
    if (this.data[key] && now - this.timestamp[key] < this.maxAge) {
      console.log("✅ Using cached data for ${key}");
      return this.data[key];
    }
    return null;
  },

  set(key, data) {
    this.data[key] = data;
    this.timestamp[key] = Date.now();
  },

  clear(key) {
    if (key) {
      delete this.data[key];
      delete this.timestamp[key];
    } else {
      this.data = {};
      this.timestamp = {};
    }
  },
};

// Dashboard API endpoints
export const dashboardApi = {
  // Get NGO dashboard data with caching
  getNgoDashboard: async (forceRefresh = false) => {
    const cacheKey = "ngo_dashboard";

    // Return cached data if available and not forcing refresh
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) return cachedData;
    }

    try {
      console.log("🔄 Fetching fresh NGO dashboard data");
      const response = await apiClient.get("/api/dashboard/ngo");

      // Cache the successful response
      if (response.data && response.data.success) {
        cache.set(cacheKey, response.data);
      }

      return response.data;
    } catch (error) {
      console.error("❌ Dashboard API error:", error);
      throw error.response?.data || error.message;
    }
  },

  // Clear dashboard cache
  clearCache: () => {
    cache.clear();
    console.log("🧹 Dashboard cache cleared");
  },
};

export default dashboardApi;
