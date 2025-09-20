import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import React from "react";
import useWalletConnect from "../hooks/useWalletConnect";

// Form field names follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
export default function AdminLogin() {
  const navigate = useNavigate();
  const { connectWallet } = useWalletConnect();
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
      // Check for MetaMask
      if (!window.ethereum) {
        throw new Error("Please install MetaMask first and create a wallet.");
      }
      if (!formData.email_or_phone || !formData.password) {
        throw new Error("Both fields are required!");
      }
      // Email validation
      const isEmail = /\S+@\S+\.\S+/.test(formData.email_or_phone);
      // Phone validation
      const isPhone = /^\d{10}$/.test(formData.email_or_phone);
      if (!isEmail && !isPhone) {
        throw new Error("Enter a valid email or 10-digit phone number!");
      }
      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters!");
      }
      // TODO: Add real admin login verification logic
      // Connect MetaMask after successful login
      await connectWallet();
      // Navigate to dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      {/* Center form slightly higher */}
      <main className="flex-grow flex justify-center items-start pt-32">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200"
        >
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-8 text-red-700">
            Admin Login
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {/* Email or Phone */}
          <input
            type="text"
            name="email_or_phone"
            placeholder="Enter Email or Phone"
            value={formData.email_or_phone}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-gray-700 space-y-2">
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
