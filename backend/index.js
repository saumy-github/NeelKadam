// Main entry point for the backend server.
require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const morgan = require("morgan"); //Import morgan
const pool = require("./db"); // Import the shared pool

const app = express();
const PORT = process.env.PORT || 3000;

// Apply Middleware
app.use(cors());          // Allows requests from all origins
app.use(express.json());  // Parses incoming JSON requests
app.use(morgan("dev"));   // Logs incoming requests

// Import auth routes for different user types
const ngoAuthRoutes = require("./routes/auth/ngo");
const panchayatAuthRoutes = require("./routes/auth/panchayat");
const communityAuthRoutes = require("./routes/auth/community");
const buyerAuthRoutes = require("./routes/auth/buyer");

// Import other routes
const projectRoutes = require("./routes/projects");
const adminRoutes = require("./routes/admin");
const adminProtectedRoutes = require("./routes/admin_route");
const dashboardRoutes = require("./routes/dashboard_route");
const buyerRoutes = require("./routes/buyer_route");

// Use auth routes with specific prefixes
app.use("/api/auth/ngo", ngoAuthRoutes);
app.use("/api/auth/panchayat", panchayatAuthRoutes);
app.use("/api/auth/community", communityAuthRoutes);
app.use("/api/auth/buyer", buyerAuthRoutes);

// Use other routes
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminProtectedRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/buyer", buyerRoutes);

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
