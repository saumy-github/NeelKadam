// Shared configuration for blockchain scripts
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";
import dotenv from "dotenv";

// Helper to get __dirname equivalent in ES modules
export function getScriptDir(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
}

// Load environment variables
const __dirname = getScriptDir(import.meta.url);
dotenv.config({ path: join(__dirname, "../.env") });

// Create require for JSON imports
export const requireJSON = createRequire(import.meta.url);

// Contract configuration
export const CONTRACT_ADDRESS = "0x365738edE45674DEAB1B2C665E66B82c80Ebe4E6";
export const PROVIDER_URL = process.env.PROVIDER_URL;
export const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

// Load contract ABI
export const contractABI = requireJSON("../../blockchain/abi.json");

// Validation helper
export function validateProviderUrl() {
  if (!PROVIDER_URL) {
    console.error(
      "Set PROVIDER_URL in backend/.env before running this script"
    );
    process.exit(1);
  }
}
