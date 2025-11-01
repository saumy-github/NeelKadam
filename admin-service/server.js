// Server startup and initialization for Admin Microservice
// This file imports the configured Express app and starts the server
// App configuration is in app.js

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.ADMIN_PORT || 3001;

// Start the server
const server = app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🔐 Admin Microservice");
  console.log("=".repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Info: http://localhost:${PORT}/`);
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
