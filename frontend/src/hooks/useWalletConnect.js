import { useState } from "react";
import { ethers } from "ethers";
import abi from "../abi.json";

const CONTRACT_ADDRESS = "0xacea7fa9e319ca2f1cadce88dd023887d017f741"; // Replace with your contract address

export default function useWalletConnect() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      setContract(contractInstance);
    } else {
      alert("Please install MetaMask!");
    }
  };

  return { account, contract, connectWallet };
}