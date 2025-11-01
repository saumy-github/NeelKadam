// Express application configuration for Admin Microservice
// This file sets up the Express app with all middleware and routes
// Server startup logic is in server.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import adminRoutes from "./src/routes/admin.js";

// Initialize Express app
const app = express();

// Apply Middleware
app.use(morgan("dev")); // Logs incoming requests
app.use(cors()); // Allows requests from all origins
app.use(express.json()); // Parses incoming JSON requests

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin service is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route - welcome message
app.get("/", (req, res) => {
  res.json({
    message: "🔐 Admin Microservice",
    status: "Running",
    version: "1.0.0",
    port: 3002,
    endpoints: {
      health: "/health",
      admin: "/api/admin/*",
    },
  });
});

// Mount admin routes
app.use("/api/admin", adminRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error("Stack:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Export the configured Express app
export default app;
