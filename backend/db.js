// d:/NeelKadam/backend/db.js
const { Pool } = require("pg");

// Create connection pool
// This is now much simpler. The connectionString from Supabase handles everything, including SSL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log database connection info
console.log(
  "📊 Database connection configured for:",
  process.env.DATABASE_URL.includes("supabase") ? "Supabase PostgreSQL" : "Remote PostgreSQL"
);

// Add event listeners for better debugging
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database:");
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
  const queryString = typeof query === "string" ? query : query.text;
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