import express from 'express';
import {
  generateCreditsController,
  transferCreditsController,
  retireCreditsController,
  getBalanceController,
  getAllTransactionsController,
  getUserTransactionsController
} from '../controllers/blockchain.controller.js';

const router = express.Router();

// POST /api/blockchain/credits/generate
router.post('/api/blockchain/credits/generate', generateCreditsController);

// POST /api/blockchain/credits/transfer
router.post('/api/blockchain/credits/transfer', transferCreditsController);

// POST /api/blockchain/credits/retire
router.post('/api/blockchain/credits/retire', retireCreditsController);

// GET /api/blockchain/balance/:address
router.get('/api/blockchain/balance/:address', getBalanceController);

// GET /api/blockchain/transactions/all
router.get('/api/blockchain/transactions/all', getAllTransactionsController);

// GET /api/blockchain/transactions/user/:address
router.get('/api/blockchain/transactions/user/:address', getUserTransactionsController);

export default router;
