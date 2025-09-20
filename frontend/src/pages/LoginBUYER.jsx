import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { buyerAuth } from "../api/auth";
import useWalletConnect from "../hooks/useWalletConnect";

export default function BuyerLogin() {
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
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Both email and password are required!");
      }

      // Email validation
      const isEmail = /\S+@\S+\.\S+/.test(formData.email);
      if (!isEmail) throw new Error("Please enter a valid email address!");

      // ✅ Removed password minimum length check

      // Call the API
      const response = await buyerAuth.login({
        email: formData.email,
        password: formData.password,
      });

      // Store authentication data
      login(response.token, response.buyer);
      // Connect MetaMask after successful login
      await connectWallet();
      // Navigate to dashboard
      navigate("/buyer/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-32">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
            Buyer Login
          </h1>
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
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-6 text-center text-sm text-gray-700 space-y-2">
            <p>
              Don’t have an account?{" "}
              <Link
                to="/signup/buyer"
                className="text-purple-700 font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p>
              <button
                type="button"
                onClick={() => navigate("/buyer/forgot-password")}
                className="text-purple-600 hover:underline"
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
