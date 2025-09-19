import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "../abi.json";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with your contract address

const BlockchainConnector = React.forwardRef((props, ref) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // Expose connectWallet to parent via ref
  React.useImperativeHandle(ref, () => ({
    connectWallet: async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        setContract(contractInstance);
      }
    }
  }));

  return (
    <div>
      <p>Connected account: {account}</p>
      {/* Add UI to interact with contract */}
    </div>
  );
});

export default BlockchainConnector;