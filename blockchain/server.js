import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import blockchainRoutes from "./src/routes/blockchain.js";
import blockchainConfig from "./src/config/blockchain.config.js";

// Configure dotenv
dotenv.config();

const { provider } = blockchainConfig;

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blockchain service is running",
    timestamp: new Date().toISOString(),
  });
});

// Blockchain routes
app.use(blockchainRoutes);

// Get port from environment or use default
const PORT = process.env.PORT || 3001;
const BLOCKCHAIN_PORT = process.env.BLOCKCHAIN_PORT || PORT;

// Start server with blockchain provider check
async function startServer() {
  try {
    await provider.getBlockNumber();
    console.log("✅ Connected to blockchain provider");
  } catch (err) {
    console.error("❌ Blockchain provider unreachable:", err.message);
    process.exit(1);
  }

  app.listen(BLOCKCHAIN_PORT, () => {
    console.log(`Blockchain service running on port ${BLOCKCHAIN_PORT}`);
  });
}

startServer();
