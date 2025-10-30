import { ethers } from 'ethers';
import dotenv from 'dotenv';
import contractABI from '../../abi.json' with { type: 'json' };

dotenv.config();

const blockchainConfig = {
  provider: new ethers.JsonRpcProvider(process.env.PROVIDER_URL),
  contractAddress: process.env.CONTRACT_ADDRESS,
  adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
  contractABI: contractABI
};

export default blockchainConfig;
