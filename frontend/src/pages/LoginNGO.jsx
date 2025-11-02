import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ngoAuth } from "../api/auth";

// Form field names follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
export default function NGOLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      if (!formData.email || !formData.password) {
        throw new Error("Both email and password are required!");
      }
      const isEmail = /\S+@\S+\.\S+/.test(formData.email);
      if (!isEmail) {
        throw new Error("Please enter a valid email address!");
      }

      // Call the API
      const response = await ngoAuth.login({
        email: formData.email,
        password: formData.password,
      });
      login(response.token, response.ngo);
      navigate("/ngo/dashboard");
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
          {/* Animated emoji/logo accent */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <span className="text-5xl animate-bounce drop-shadow">🪴</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-8 text-green-700 drop-shadow">
            Seller Login
          </h1>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl font-semibold flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg bg-gradient-to-r from-emerald-50 to-white transition"
              required
              disabled={loading}
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
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-gradient-to-r from-blue-50 to-white transition"
              required
              disabled={loading}
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-400 text-white hover:bg-green-800 shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
