import axios from "axios";

// API base configuration
const API_BASE_URL = "http://localhost:3000/api";

console.log("🌐 API client configured with base URL:", API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds for blockchain transactions
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and log requests
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing request (without sensitive data)
    const logConfig = { ...config };

    // Don't log full request body for privacy/security
    if (logConfig.data) {
      const dataKeys = Object.keys(logConfig.data);
      logConfig.data = `[${dataKeys.length} fields: ${dataKeys.join(", ")}]`;
    }

    console.log(
      `🚀 API Request: ${config.method.toUpperCase()} ${config.url}`,
      logConfig
    );
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response (${response.status}):`, {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      // Log data structure but not content for privacy
      dataStructure: response.data ? Object.keys(response.data) : null,
    });
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error (${error.response?.status || "Network Error"}):`,
      {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        errorData: error.response?.data,
      }
    );

    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized access detected - redirecting to login");
      // Clear auth data on unauthorized
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
