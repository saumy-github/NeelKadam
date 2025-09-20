import { Link, useNavigate } from "react-router-dom";

// Object properties follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
export default function BuyerProfile() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    alert("Signed out successfully!");
    navigate("/login/buyer");
  };

  // ✅ Demo Buyer data (later replace with backend)
  const buyerDetails = {
    company_name: "Example Corp",
    email: "buyer@example.com",
    wallet_address: "0x1234abcd5678efgh",
  };

  const wallet = {
    balance: 120,
  };

  const transactions = [
    { id: 1, type: "Purchase", amount: "50 CC", status: "Completed" },
    { id: 2, type: "Sale", amount: "30 CC", status: "Completed" },
    { id: 3, type: "Purchase", amount: "40 CC", status: "Pending" },
    { id: 4, type: "Purchase", amount: "100 CC", status: "Completed" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3]">
      {/* ✅ Same taskbar as BuyerDashboard */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Buyer Dashboard</h1>
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link to="/buyer/profile" className="hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:underline">
              Blog
            </Link>
          </li>
        </ul>
      </nav>

      {/* ✅ Main content area */}
      <main className="flex-grow p-8 space-y-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Buyer Profile
        </h1>

        {/* ✅ Buyer Details */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Buyer Details</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Company Name:</strong> {buyerDetails.company_name}
            </li>
            <li>
              <strong>Email:</strong> {buyerDetails.email}
            </li>
            
            <li>
              <strong>Wallet Address:</strong> {buyerDetails.wallet_address}
            </li>
          </ul>
        </section>

        {/* ✅ Wallet Info */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet</h2>
          <p className="text-gray-700">
            <strong>Balance:</strong> {wallet.balance} CC
          </p>
        </section>

        {/* ✅ Transactions */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between p-3 border rounded-lg bg-gray-50"
              >
                <span>
                  {tx.type} – {tx.amount}
                </span>
                <span
                  className={
                    tx.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              alert("Signed out successfully!");
              window.location.href = "/"; // ✅ always go to main home page
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
