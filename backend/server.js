// Server startup and initialization
// This file imports the configured Express app and starts the server
// App configuration is in app.js

import "dotenv/config";
import app from "./app.js";
import axios from "axios";

const PORT = process.env.PORT || 3000;

// Check blockchain microservice connectivity
(async () => {
  try {
    const { data } = await axios.get(`${process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:3001'}/health`);
    console.log('✅ Blockchain microservice reachable:', data);
  } catch (err) {
    console.error('❌ Cannot reach blockchain microservice:', err.message);
  }
})();

// Start the server
const server = app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🌊 Blue Carbon Registry API Server");
  console.log("=".repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`🔍 Database Test: http://localhost:${PORT}/api/test_connection`);
  console.log("=".repeat(50));
});

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error("Please stop the other process or use a different port");
  } else {
    console.error("❌ Server error:", error.message);
  }
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n⚠️  SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error.message);
  console.error(error.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
  process.exit(1);
});
