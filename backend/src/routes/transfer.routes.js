// Carbon credit transfer routes
// Handles CC transfers from sellers to buyers after blockchain transaction
// Updates both seller and buyer balances atomically

import express from "express";
import { authMiddleware } from "../middleware/index.middleware.js";
import { transferCarbonCredits } from "../controllers/transfer.controller.js";

const router = express.Router();

// POST /api/transfer/cc - Transfer carbon credits from seller to buyer
router.post("/cc", authMiddleware, transferCarbonCredits);

// POST /api/transfer/complete - Alternative endpoint (alias for /cc)
router.post("/complete", authMiddleware, transferCarbonCredits);

export default router;
