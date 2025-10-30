/**
 * HTTP client for blockchain microservice
 * This service communicates with the separate blockchain service
 * running on port 3001
 */

import axios from 'axios';

const BLOCKCHAIN_SERVICE_URL = process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:3001';

const blockchainApi = axios.create({
  baseURL: BLOCKCHAIN_SERVICE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Generate carbon credits for an NGO
 * @param {string} ngoAddress - The wallet address of the NGO
 * @param {number} amount - The amount of carbon credits to generate
 * @returns {Promise<Object>} - Response data from blockchain service
 */
async function generateCredits(ngoAddress, amount) {
  try {
    const response = await blockchainApi.post(
      '/api/blockchain/credits/generate',
      { address: ngoAddress, amount }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to generate credits';
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

/**
 * Transfer carbon credits from one address to another
 * @param {string} fromAddress - The sender wallet address
 * @param {string} toAddress - The recipient wallet address
 * @param {number} amount - The amount of carbon credits to transfer
 * @returns {Promise<Object>} - Response data from blockchain service
 */
async function transferCredits(fromAddress, toAddress, amount) {
  try {
    const response = await blockchainApi.post(
      '/api/blockchain/credits/transfer',
      { fromAddress, toAddress, amount }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to transfer credits';
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

/**
 * Retire carbon credits for a buyer
 * @param {string} buyerAddress - The wallet address of the buyer
 * @param {number} amount - The amount of carbon credits to retire
 * @returns {Promise<Object>} - Response data from blockchain service
 */
async function retireCredits(buyerAddress, amount) {
  try {
    const response = await blockchainApi.post(
      '/api/blockchain/credits/retire',
      { address: buyerAddress, amount }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to retire credits';
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

/**
 * Get balance of carbon credits for an address
 * @param {string} address - The wallet address to check balance
 * @returns {Promise<Object>} - Response data from blockchain service
 */
async function getBalance(address) {
  try {
    const response = await blockchainApi.get(
      `/api/blockchain/balance/${address}`
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get balance';
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

/**
 * Get all transactions from the blockchain
 * @returns {Promise<Object>} - Response data from blockchain service
 */
async function getAllTransactions() {
  try {
    const response = await blockchainApi.get(
      '/api/blockchain/transactions/all'
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get transactions';
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

/**
 * Get transactions for a specific user address
 * @param {string} address - The wallet address to get transactions for
 * @returns {Promise<Object>} - Response data from blockchain service
 */
async function getUserTransactions(address) {
  try {
    const response = await blockchainApi.get(
      `/api/blockchain/transactions/user/${address}`
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get user transactions';
    throw new Error(`Blockchain service error: ${errorMessage}`);
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
