// d:/SIH_2025/backend/db.js
const { Pool } = require("pg");
require("dotenv").config();

// Database connection parameters
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// Log database connection info (without password)
console.log("📊 Database connection parameters:", {
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  port: dbConfig.port,
});

// Create connection pool
const pool = new Pool(dbConfig);

// Add event listeners for better debugging
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database:", dbConfig.database);
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
  console.error("Error stack:", err.stack);
});

// Wrap the query method to add logging
const originalQuery = pool.query;
pool.query = function (...args) {
  const query = args[0];
  const queryStart = new Date();

  // Log the query (truncate if too long)
  const queryString = typeof query === "string" ? query : query.text;

  // Only log the first 100 characters of the query to avoid cluttering logs
  const truncatedQuery =
    queryString.length > 100
      ? queryString.substring(0, 100) + "..."
      : queryString;

  console.log(`🔍 Executing query: ${truncatedQuery}`);

  return originalQuery
    .apply(this, args)
    .then((result) => {
      const duration = new Date() - queryStart;
      console.log(`✅ Query completed in ${duration}ms`);
      return result;
    })
    .catch((err) => {
      const duration = new Date() - queryStart;
      console.error(`❌ Query failed after ${duration}ms:`, err.message);
      throw err;
    });
};

// Test database connection on startup
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database connection test successful"))
  .catch((err) =>
    console.error("❌ Database connection test failed:", err.message)
  );

module.exports = pool;
