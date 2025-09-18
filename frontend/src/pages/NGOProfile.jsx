import { Link, useNavigate } from "react-router-dom";

// Object properties follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
export default function NGOProfile() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    alert("Signed out successfully!");
    navigate("/login/ngo");
  };

  // ✅ Demo NGO data (later replace with backend data)
  const ngoDetails = {
    ngo_name: "Mangrove Foundation",
    license_no: "LIC123456",
    email: "ngo@example.com",
    phone: "+91-9876543210",
    spokesperson_name: "Ravi Kumar",
    spokesperson_mobile: "+91-9876543210",
    pan_no: "ABCDE1234F",
    bank: {
      account_holder_name: "Mangrove Foundation",
      account_number: "1234567890",
      ifsc_code: "SBIN0001234",
      micr: "110002345",
    },
  };

  const wallet = {
    balance: 350,
    total_cc: 500,
  };

  const transactions = [
    { id: 1, type: "Credit", amount: "50 CC", status: "Completed" },
    { id: 2, type: "Debit", amount: "20 CC", status: "Pending" },
    { id: 3, type: "Credit", amount: "100 CC", status: "Completed" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcedd3]">
      {/* ✅ Same taskbar as Dashboard */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">NGO Dashboard</h1>
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
            <Link to="/ngo/profile" className="hover:underline">
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
        <h1 className="text-3xl font-bold text-green-700 mb-6">NGO Profile</h1>

        {/* ✅ NGO Details */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">NGO Details</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Name:</strong> {ngoDetails.ngo_name}
            </li>
            <li>
              <strong>License No:</strong> {ngoDetails.license_no}
            </li>
            <li>
              <strong>Email:</strong> {ngoDetails.email}
            </li>
            <li>
              <strong>Phone:</strong> {ngoDetails.phone}
            </li>
            <li>
              <strong>Spokesperson:</strong> {ngoDetails.spokesperson_name}
            </li>
            <li>
              <strong>PAN No:</strong> {ngoDetails.pan_no}
            </li>
            <li>
              <strong>Bank Details:</strong>
              <br />
              {ngoDetails.bank.account_holder_name}, A/C:{" "}
              {ngoDetails.bank.account_number},<br />
              IFSC: {ngoDetails.bank.ifsc_code}, MICR: {ngoDetails.bank.micr}
            </li>
          </ul>
        </section>

        {/* ✅ Wallet Info */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet</h2>
          <p className="text-gray-700">
            <strong>Balance:</strong> {wallet.balance} CC
          </p>
          <p className="text-gray-700">
            <strong>Total Credits Earned:</strong> {wallet.total_cc} CC
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

        {/* ✅ Sign Out */}
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
