import apiClient from "./config";

// Project Management APIs
export const projectApi = {
  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await apiClient.post("/projects", projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all projects
  getAllProjects: async (filters = {}) => {
    try {
      const response = await apiClient.get("/projects", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await apiClient.put(
        `/projects/${projectId}`,
        projectData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await apiClient.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get projects by seller (NGO/Panchayat/Community)
  getProjectsBySeller: async (sellerId, sellerType) => {
    try {
      const response = await apiClient.get(`/projects/seller/${sellerId}`, {
        params: { seller_type: sellerType },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update project status
  updateProjectStatus: async (projectId, status) => {
    try {
      const response = await apiClient.patch(`/projects/${projectId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload project photos
  uploadPhotos: async (projectId, photos) => {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append("photos", photo);
      });

      const response = await apiClient.post(
        `/projects/${projectId}/photos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
