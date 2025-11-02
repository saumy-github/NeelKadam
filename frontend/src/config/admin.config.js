/**
 * Admin Configuration
 * Contains admin-specific settings and constants
 */

/**
 * Default Admin Wallet Address
 * This is the official admin wallet address used for blockchain operations
 * like project approvals and token minting.
 */
export const ADMIN_WALLET_ADDRESS = "0x447a55a1036b4c0d8ae339fa6b93e7ce405c6e91";

/**
 * Verify if a given address matches the admin wallet address
 * @param {string} address - Address to verify
 * @returns {boolean} - True if address matches admin wallet
 */
export const isAdminWallet = (address) => {
  if (!address) return false;
  return address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();
};

/**
 * Admin Configuration Object
 */
export const adminConfig = {
  walletAddress: ADMIN_WALLET_ADDRESS,
  isAdminWallet,
};

export default adminConfig;
