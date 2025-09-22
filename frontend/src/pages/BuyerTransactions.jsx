import React, { useEffect, useState } from "react";
import useWalletConnect from "../hooks/useWalletConnect";

export default function BuyerTransactions() {
  const { account, contract, connectWallet } = useWalletConnect();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      await connectWallet();
      if (contract && account) {
        setLoading(true);
        setError("");
        try {
          const allTx = await contract.getAllTransactions();
          setTransactions(allTx);
        } catch (err) {
          setError("Could not fetch transactions");
        }
        setLoading(false);
      }
    }
    fetchTransactions();
    // eslint-disable-next-line
  }, [account, contract]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3] p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">All Transactions</h1>
      {loading ? (
        <div>Loading transactions...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : transactions.length === 0 ? (
        <div>No transaction found</div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id ? tx.id.toString() : idx}
              className="p-4 border rounded-lg bg-white shadow"
            >
              <div><strong>Type:</strong> {tx.txType}</div>
              <div><strong>Credit ID:</strong> {tx.creditId?.toString?.() || "-"}</div>
              <div><strong>From:</strong> {tx.from}</div>
              <div><strong>To:</strong> {tx.to}</div>
              <div><strong>Timestamp:</strong> {tx.timestamp ? new Date(Number(tx.timestamp) * 1000).toLocaleString() : "-"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
