import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    alert("Signed out successfully!");
    navigate("/login/admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Admin Header */}
      <nav className="bg-red-700 text-white p-5 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-lg">Admin Dashboard</h1>
        <ul className="flex flex-wrap gap-8 text-base font-semibold">
          <li><Link to="/" className="hover:underline hover:text-red-300 transition">Home</Link></li>
          <li><Link to="/about" className="hover:underline hover:text-red-300 transition">About</Link></li>
          <li><Link to="/admin/profile" className="hover:underline hover:text-red-300 transition">Profile</Link></li>
          <li><Link to="/blog" className="hover:underline hover:text-red-300 transition">Blog</Link></li>
          <li><Link to="/admin/ngos" className="hover:underline hover:text-red-300 transition">NGOs</Link></li>
          <li><Link to="/admin/buyers" className="hover:underline hover:text-red-300 transition">Buyers</Link></li>
          <li><Link to="/admin/projects" className="hover:underline hover:text-red-300 transition">Projects</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow px-10 py-12 max-w-7xl mx-auto space-y-14 overflow-y-auto">
        <h2 className="text-3xl font-black text-red-700 drop-shadow-md">Welcome, Admin</h2>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Total NGOs", value: 54, color: "emerald" },
            { label: "Total Buyers", value: 78, color: "blue" },
            { label: "Total Projects", value: 132, color: "amber" }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-white p-8 rounded-3xl shadow-md border-l-8 border-${stat.color}-500 hover:shadow-xl transition transform hover:-translate-y-1 cursor-default`}
            >
              <h3 className={`text-2xl font-bold text-${stat.color}-700 mb-4`}>{stat.label}</h3>
              <p className={`text-5xl font-extrabold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Management Panels */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "NGO Management",
              description: "View, verify, and manage registered NGOs.",
              link: "/admin/ngos",
            },
            {
              title: "Buyer Management",
              description: "Monitor buyer registrations and activities.",
              link: "/admin/buyers",
            },
            {
              title: "Project Verification",
              description: "Check NGO project status and approvals.",
              link: "/admin/projects",
            },
          ].map((panel) => (
            <div
              key={panel.title}
              className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-semibold text-red-700 mb-6">{panel.title}</h3>
              <p className="text-gray-700 mb-6">{panel.description}</p>
              <Link
                to={panel.link}
                className="px-6 py-3 bg-red-700 text-white rounded-xl hover:bg-red-800 shadow-lg transition"
              >
                {`Manage ${panel.title.split(" ")[0]}`}
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Panels */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Carbon Credits",
              description: "Track newly generated CC and listings.",
              link: "/admin/cc",
              color: "green"
            },
            {
              title: "Transactions",
              description: "Keep a check on all CC transactions.",
              link: "/admin/transactions",
              color: "yellow"
            },
            {
              title: "Reports",
              description: "Generate and review detailed reports.",
              link: "/admin/reports",
              color: "purple"
            },
          ].map((panel) => (
            <div
              key={panel.title}
              className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className={`text-2xl font-semibold text-red-700 mb-6`}>{panel.title}</h3>
              <p className="text-gray-700 mb-6">{panel.description}</p>
              <Link
                to={panel.link}
                className="px-6 py-3 bg-red-700 text-white rounded-xl hover:bg-red-800 shadow-lg transition"
              >
                {`View ${panel.title}`}
              </Link>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              alert("Signed out successfully!");
              window.location.href = "/";
            }}
            className="px-8 py-3 bg-red-600 text-white rounded-3xl text-xl font-bold shadow-lg hover:bg-red-700 transition-all"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
