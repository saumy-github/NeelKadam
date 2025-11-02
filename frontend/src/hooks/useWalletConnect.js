import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../abi.json";

const CONTRACT_ADDRESS = "0x365738edE45674DEAB1B2C665E66B82c80Ebe4E6"; // Replace with your contract address

export default function useWalletConnect() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
          setIsConnected(false);
        }
      });

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        setContract(contractInstance);
        setIsConnected(true);
        return address;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        throw error;
      }
    } else {
      alert("Please install MetaMask!");
      throw new Error("MetaMask not installed");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setIsConnected(false);
  };

  return { 
    account, 
    contract, 
    connectWallet, 
    disconnectWallet,
    isConnected 
  };
}