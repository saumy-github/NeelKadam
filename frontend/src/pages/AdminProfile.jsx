import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    sessionStorage.clear();
    navigate("/");
  };

  // Safe-access fields from user object
  const name = user?.name || user?.email || "Administrator";
  const email = user?.email || "admin@neelkadam.org";
  const role = (user?.role || "admin").toString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f6f3] flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
            <p className="text-sm text-gray-500">Manage your account information</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-800">Back to dashboard</Link>
            <button onClick={handleSignOut} className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">Sign out</button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: profile card */}
            <section className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{role}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-700">{email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Member since</p>
                  <p className="text-sm text-gray-700">Not Available</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm text-gray-700">Not Provided</p>
                </div>
              </div>
            </section>

            {/* Right: details and actions */}
            <section className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-xs text-gray-400">Username</p>
                    <p className="text-sm text-gray-700">{name}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm text-gray-700">{email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Security</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-xs text-gray-400">Password</p>
                    <p className="text-sm text-gray-700">••••••••</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-xs text-gray-400">Two-factor</p>
                    <p className="text-sm text-gray-700">Disabled</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Activity</h3>
                <p className="text-sm text-gray-600">No recent activity to show.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
