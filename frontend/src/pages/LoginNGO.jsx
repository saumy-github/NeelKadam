import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ngoAuth } from "../api/auth";
import useWalletConnect from "../hooks/useWalletConnect";

// Form field names follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
export default function NGOLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { connectWallet } = useWalletConnect();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
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

      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Both email and password are required!");
      }

      // Email validation
      const isEmail = /\S+@\S+\.\S+/.test(formData.email);
      if (!isEmail) {
        throw new Error("Please enter a valid email address!");
      }

      
      // Call the API
      const response = await ngoAuth.login({
        email: formData.email,
        password: formData.password,
      });

      // Store authentication data
      login(response.token, response.ngo);

      // Connect MetaMask after successful login
      await connectWallet();

      // Navigate to dashboard
      navigate("/ngo/dashboard");
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
          <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
            Seller Login
          </h1>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={loading}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={loading}
          />

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-gray-700 space-y-2">
            <p>
              Don’t have an account?{" "}
              <Link
                to="/signup/ngo"
                className="text-green-700 font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-green-600 hover:underline"
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
