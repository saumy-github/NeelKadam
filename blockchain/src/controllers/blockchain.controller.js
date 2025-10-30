import {
  generateCredits,
  transferCredits,
  retireCredits,
  getBalance,
  getAllTransactions,
  getUserTransactions
} from '../services/blockchain.service.js';

/**
 * Controller to generate carbon credits
 */
async function generateCreditsController(req, res) {
  try {
    const { address, amount } = req.body;

    if (!address || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Address and amount are required'
      });
    }

    const result = await generateCredits(address, amount);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate credits',
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Credits generated successfully',
      data: {
        txHash: result.txHash,
        receipt: result.receipt
      }
    });
  } catch (error) {
    console.error('Error in generateCreditsController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * Controller to transfer carbon credits
 */
async function transferCreditsController(req, res) {
  try {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Recipient address and amount are required'
      });
    }

    const result = await transferCredits(toAddress, amount);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to transfer credits',
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Credits transferred successfully',
      data: {
        txHash: result.txHash,
        receipt: result.receipt
      }
    });
  } catch (error) {
    console.error('Error in transferCreditsController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * Controller to retire carbon credits
 */
async function retireCreditsController(req, res) {
  try {
    const { address, amount } = req.body;

    if (!address || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Address and amount are required'
      });
    }

    const result = await retireCredits(address, amount);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retire credits',
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Credits retired successfully',
      data: {
        txHash: result.txHash,
        receipt: result.receipt
      }
    });
  } catch (error) {
    console.error('Error in retireCreditsController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * Controller to get balance of an address
 */
async function getBalanceController(req, res) {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const result = await getBalance(address);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get balance',
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Balance retrieved successfully',
      data: {
        address,
        balance: result.balance
      }
    });
  } catch (error) {
    console.error('Error in getBalanceController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * Controller to get all transactions
 */
async function getAllTransactionsController(req, res) {
  try {
    const result = await getAllTransactions();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get transactions',
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions: result.transactions,
        count: result.transactions.length
      }
    });
  } catch (error) {
    console.error('Error in getAllTransactionsController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * Controller to get transactions for a specific user
 */
async function getUserTransactionsController(req, res) {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const result = await getUserTransactions(address);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get user transactions',
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User transactions retrieved successfully',
      data: {
        address,
        transactions: result.transactions,
        count: result.transactions.length
      }
    });
  } catch (error) {
    console.error('Error in getUserTransactionsController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

export {
  generateCreditsController,
  transferCreditsController,
  retireCreditsController,
  getBalanceController,
  getAllTransactionsController,
  getUserTransactionsController
};
