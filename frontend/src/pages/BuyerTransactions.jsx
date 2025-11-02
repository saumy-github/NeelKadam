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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 drop-shadow">
        All Transactions
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-lg shadow mb-4">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-gray-600 text-lg text-center py-20">
          No transactions found.
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id ? tx.id.toString() : idx}
              className="p-6 border rounded-2xl bg-white shadow-lg hover:shadow-2xl transition"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-800 text-lg">
                <div>
                  <span className="font-semibold">Type:</span> {tx.txType}
                </div>
                <div>
                  <span className="font-semibold">Credit ID:</span> {tx.creditId?.toString?.() || "-"}
                </div>
                <div>
                  <span className="font-semibold">From:</span> {tx.from}
                </div>
                <div>
                  <span className="font-semibold">To:</span> {tx.to}
                </div>
                <div className="col-span-full mt-2 md:mt-0">
                  <span className="font-semibold">Timestamp:</span>{" "}
                  {tx.timestamp ? new Date(Number(tx.timestamp) * 1000).toLocaleString() : "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
