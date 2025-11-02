import { ethers } from 'ethers';
import blockchainConfig from '../config/blockchain.config.js';

const { provider, contractAddress, adminPrivateKey, contractABI } = blockchainConfig;

// Helper to create contract with wallet
function getContractWithWallet() {
  if (!adminPrivateKey) {
    throw new Error('ADMIN_PRIVATE_KEY not set in environment');
  }
  const wallet = new ethers.Wallet(adminPrivateKey, provider);
  return new ethers.Contract(contractAddress, contractABI, wallet);
}

// Helper to create contract with provider only (read-only)
function getContractReadOnly() {
  return new ethers.Contract(contractAddress, contractABI, provider);
}

/**
 * Generate carbon credits for an address
 * @param {string} address - The wallet address to receive credits
 * @param {number} amount - The amount of carbon credits to generate
 * @returns {Promise<{success: boolean, txHash: string, error: string}>}
 */
async function generateCredits(address, amount) {
  try {
    console.log(`Generating ${amount} carbon credits for address: ${address}`);

    if (!address || !ethers.isAddress(address)) {
      throw new Error('Invalid wallet address');
    }

    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Amount must be a positive integer');
    }

    const contract = getContractWithWallet();
    const tx = await contract.generateCredits(address, amount);
    console.log('Transaction sent, tx.hash:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction mined. blockNumber:', receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
      error: null,
      receipt
    };
  } catch (error) {
    console.error('Error generating carbon credits:', error.message || error);
    return {
      success: false,
      txHash: null,
      error: error.message || String(error)
    };
  }
}

/**
 * Transfer carbon credits from one address to another
 * @param {string} toAddress - The recipient wallet address
 * @param {number} amount - The amount of carbon credits to transfer
 * @returns {Promise<{success: boolean, txHash: string, error: string}>}
 */
async function transferCredits(toAddress, amount) {
  try {
    console.log(`Transferring ${amount} carbon credits to address: ${toAddress}`);

    if (!toAddress || !ethers.isAddress(toAddress)) {
      throw new Error('Invalid recipient wallet address');
    }

    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Amount must be a positive integer');
    }

    const contract = getContractWithWallet();
    const tx = await contract.transfer(toAddress, amount);
    console.log('Transaction sent, tx.hash:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction mined. blockNumber:', receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
      error: null,
      receipt
    };
  } catch (error) {
    console.error('Error transferring carbon credits:', error.message || error);
    return {
      success: false,
      txHash: null,
      error: error.message || String(error)
    };
  }
}

/**
 * Retire carbon credits for an address
 * @param {string} address - The wallet address to retire credits from
 * @param {number} amount - The amount of carbon credits to retire
 * @returns {Promise<{success: boolean, txHash: string, error: string}>}
 */
async function retireCredits(address, amount) {
  try {
    console.log(`Retiring ${amount} carbon credits for address: ${address}`);

    if (!address || !ethers.isAddress(address)) {
      throw new Error('Invalid wallet address');
    }

    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Amount must be a positive integer');
    }

    const contract = getContractWithWallet();
    const tx = await contract.retireCredits(address, amount);
    console.log('Transaction sent, tx.hash:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction mined. blockNumber:', receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
      error: null,
      receipt
    };
  } catch (error) {
    console.error('Error retiring carbon credits:', error.message || error);
    return {
      success: false,
      txHash: null,
      error: error.message || String(error)
    };
  }
}

/**
 * Get balance of carbon credits for an address
 * @param {string} address - The wallet address to check balance
 * @returns {Promise<{success: boolean, balance: number, error: string}>}
 */
async function getBalance(address) {
  try {
    console.log(`Getting balance for address: ${address}`);

    if (!address || !ethers.isAddress(address)) {
      throw new Error('Invalid wallet address');
    }

    const contract = getContractReadOnly();
    const balance = await contract.balanceOf(address);
    
    return {
      success: true,
      balance: Number(balance),
      error: null
    };
  } catch (error) {
    console.error('Error getting balance:', error.message || error);
    return {
      success: false,
      balance: null,
      error: error.message || String(error)
    };
  }
}

/**
 * Get all transactions from the blockchain
 * @returns {Promise<{success: boolean, transactions: array, error: string}>}
 */
async function getAllTransactions() {
  try {
    console.log('Getting all transactions from blockchain');

    const contract = getContractReadOnly();
    
    // Get Transfer events
    const transferFilter = contract.filters.Transfer();
    const transferEvents = await contract.queryFilter(transferFilter);
    
    const transactions = transferEvents.map(event => ({
      from: event.args.from,
      to: event.args.to,
      amount: Number(event.args.value),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));

    return {
      success: true,
      transactions,
      error: null
    };
  } catch (error) {
    console.error('Error getting all transactions:', error.message || error);
    return {
      success: false,
      transactions: null,
      error: error.message || String(error)
    };
  }
}

/**
 * Get transactions for a specific user address
 * @param {string} address - The wallet address to get transactions for
 * @returns {Promise<{success: boolean, transactions: array, error: string}>}
 */
async function getUserTransactions(address) {
  try {
    console.log(`Getting transactions for address: ${address}`);

    if (!address || !ethers.isAddress(address)) {
      throw new Error('Invalid wallet address');
    }

    const contract = getContractReadOnly();
    
    // Get Transfer events where user is sender or recipient
    const sentFilter = contract.filters.Transfer(address, null);
    const receivedFilter = contract.filters.Transfer(null, address);
    
    const sentEvents = await contract.queryFilter(sentFilter);
    const receivedEvents = await contract.queryFilter(receivedFilter);
    
    const allEvents = [...sentEvents, ...receivedEvents];
    
    // Remove duplicates and sort by block number
    const uniqueEvents = allEvents.filter((event, index, self) =>
      index === self.findIndex(e => e.transactionHash === event.transactionHash)
    ).sort((a, b) => b.blockNumber - a.blockNumber);
    
    const transactions = uniqueEvents.map(event => ({
      from: event.args.from,
      to: event.args.to,
      amount: Number(event.args.value),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));

    return {
      success: true,
      transactions,
      error: null
    };
  } catch (error) {
    console.error('Error getting user transactions:', error.message || error);
    return {
      success: false,
      transactions: null,
      error: error.message || String(error)
    };
  }
}

export {
  generateCredits,
  transferCredits,
  retireCredits,
  getBalance,
  getAllTransactions,
  getUserTransactions
};
