import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.emailOrPhone || !formData.password) {
      alert("Both fields are required!");
      return;
    }

    // Email validation
    const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrPhone);
    // Phone validation
    const isPhone = /^\d{10}$/.test(formData.emailOrPhone);

    if (!isEmail && !isPhone) {
      alert("Enter a valid email or 10-digit phone number!");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }

    // TODO: Add real admin login verification logic
    alert("Admin login successful (demo)!");
    navigate("/admin/dashboard");
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

          {/* Email or Phone */}
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Enter Email or Phone"
            value={formData.emailOrPhone}
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
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            Login
          </button>

          {/* Footer links */}
          
        </form>
      </main>
    </div>
  );
}
