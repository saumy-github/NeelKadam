// Express application configuration
// This file sets up the Express app with all middleware and routes
// Server startup logic is in server.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import pool from "./src/config/database.config.js";

// Import routes from new organized structure
import apiRoutes from "./src/routes/index.js";

// Import admin routes (kept in old location, will be moved in Phase 3)
import adminRoutes from "./routes/admin.js";
import adminProtectedRoutes from "./routes/admin_route.js";

// Initialize Express app
const app = express();

// Apply Middleware
app.use(morgan("dev")); // Logs incoming requests
app.use(cors()); // Allows requests from all origins
app.use(express.json()); // Parses incoming JSON requests

// Mount all API routes (auth, projects, buyer, dashboard)
app.use("/api", apiRoutes);

// Mount admin routes (will be refactored in Phase 3)
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminProtectedRoutes);

// Root route - welcome message
app.get("/", (req, res) => {
  res.json({
    message: "🌊 Blue Carbon Registry API Server",
    status: "Running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/*",
      projects: "/api/projects",
      admin: "/api/admin",
      dashboard: "/api/dashboard",
      buyer: "/api/buyer",
      test: "/api/test_connection",
    },
  });
});

// Test database connection endpoint
app.get("/api/test_connection", async (req, res) => {
  console.log("🔵 Database connection test endpoint hit!");

  try {
    console.log("🔍 Testing database connection...");
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful!");

    res.json({
      success: true,
      message: "Database connection successful!",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("❌ Database connection test failed:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Database connection failed!",
      error: error.message,
    });
  }
});

// Export the configured Express app
export default app;
