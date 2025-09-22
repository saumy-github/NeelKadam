import apiClient from "./config";

// Buyer API endpoints
export const buyerApi = {
  // Get buyer dashboard data
  getBuyerDashboard: async () => {
    try {
      const response = await apiClient.get("/buyer/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update buyer wallet address
  updateWalletAddress: async (walletAddress) => {
    try {
      const response = await apiClient.patch("/buyer/update-wallet", {
        wallet_address: walletAddress,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default buyerApi;
