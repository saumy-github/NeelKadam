import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import React from "react";

// Form field names follow snake_case convention to align with the backend API contract.
export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask first and create a wallet.");
      }
      if (!formData.email_or_phone || !formData.password) {
        throw new Error("Both fields are required!");
      }
      const isEmail = /\S+@\S+\.\S+/.test(formData.email_or_phone);
      const isPhone = /^\d{10}$/.test(formData.email_or_phone);
      if (!isEmail && !isPhone) {
        throw new Error("Enter a valid email or 10-digit phone number!");
      }
      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters!");
      }
      // TODO: Add real admin login verification logic
      await connectWallet();
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <main className="flex-grow flex justify-center items-start pt-28">
        <form
          onSubmit={handleLogin}
          className="relative bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200"
        >
          {/* Animated emoji accent */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <span className="text-5xl animate-bounce drop-shadow">🛡️</span>
          </div>
          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-8 text-red-700 drop-shadow">
            Admin Login
          </h1>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl font-semibold flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}
          {/* Email or Phone */}
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">
              Email or Phone
            </label>
            <input
              type="text"
              name="email_or_phone"
              placeholder="Enter Email or Phone"
              value={formData.email_or_phone}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-lg bg-gradient-to-r from-red-50 to-white transition"
              required
            />
          </div>
          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-lg bg-gradient-to-r from-blue-50 to-white transition"
              required
            />
          </div>
          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-500 via-red-600 to-red-400 text-white hover:bg-red-700 shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" 
                    stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 
                    7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>
          {/* Footer links */}
          <div className="mt-8 text-center text-base text-gray-700 space-y-2">
            <p>
              Don’t have an account?{" "}
              <Link
                to="/signup/admin"
                className="text-red-700 font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-red-600 hover:underline"
              >
                Forgot Password?
              </button>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
