// Admin microservice HTTP client configuration
export const adminServiceConfig = {
  serviceUrl: process.env.ADMIN_SERVICE_URL || "http://localhost:3002",
  timeout: 300000, // 5 min
  headers: { "Content-Type": "application/json" },
};

export default adminServiceConfig;
