// Blockchain microservice HTTP client configuration
export const blockchainServiceConfig = {
  serviceUrl: process.env.BLOCKCHAIN_SERVICE_URL || "http://localhost:3001",
  timeout: 120000, // 2 minutes - blockchain transactions can take time to mine
  headers: { "Content-Type": "application/json" },
};

export default blockchainServiceConfig;
