// HTTP client for blockchain microservice
import axios from "axios";
import blockchainServiceConfig from "../config/blockchainMS.config.js";

const blockchainApi = axios.create({
  baseURL: blockchainServiceConfig.serviceUrl,
  timeout: blockchainServiceConfig.timeout,
  headers: blockchainServiceConfig.headers,
});

// Generate carbon credits for an NGO
async function generateCredits(ngoAddress, amount) {
  try {
    const response = await blockchainApi.post(
      "/api/blockchain/credits/generate",
      { address: ngoAddress, amount }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to generate credits";
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

// Transfer carbon credits from one address to another
async function transferCredits(fromAddress, toAddress, amount) {
  try {
    const response = await blockchainApi.post(
      "/api/blockchain/credits/transfer",
      { fromAddress, toAddress, amount }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to transfer credits";
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

// Retire carbon credits for a buyer
async function retireCredits(buyerAddress, amount) {
  try {
    const response = await blockchainApi.post(
      "/api/blockchain/credits/retire",
      { address: buyerAddress, amount }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to retire credits";
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

// Get balance of carbon credits for an address
async function getBalance(address) {
  try {
    const response = await blockchainApi.get(
      `/api/blockchain/balance/${address}`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to get balance";
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

// Get all transactions from the blockchain
async function getAllTransactions() {
  try {
    const response = await blockchainApi.get(
      "/api/blockchain/transactions/all"
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to get transactions";
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

// Get transactions for a specific user address
async function getUserTransactions(address) {
  try {
    const response = await blockchainApi.get(
      `/api/blockchain/transactions/user/${address}`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to get user transactions";
    throw new Error(`Blockchain service error: ${errorMessage}`);
  }
}

export {
  generateCredits,
  transferCredits,
  retireCredits,
  getBalance,
  getAllTransactions,
  getUserTransactions,
};
