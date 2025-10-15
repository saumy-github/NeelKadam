import apiClient from "../api/config.js";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyerSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    password: "",
    confirm_password: "",
    email_otp: "",
    pan_no: "",
    is_verified: false,
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    wallet_address: "",
  });

  const [loading, setLoading] = useState(false);

  // Password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Removed OTP method selection

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirm_password)
        return;
      if (formData.password !== formData.confirm_password) return;
    }
    if (step === 2 && !formData.email_otp) return;
    if (step === 3 && !formData.pan_no) return;
    if (step === 4 && !formData.wallet_address) return;

    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Use the apiClient with the correct path
      const response = await apiClient.post(
        "/api/auth/buyer/register",
        formData
      );

      console.log("✅ Registration successful:", response.data);
      navigate("/login/buyer");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      console.error("❌ Error during registration:", errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-10">
        <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-2xl border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
            Buyer Sign Up
          </h1>
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg">
            Please create a MetaMask wallet/account before signing up.
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                Step 1: Account Setup
              </h2>
              <input
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              {/* Removed phone input */}

              {/* Password */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-3 text-sm text-gray-600"
                >
                  {showPassword ? "Hide" : "View"}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative mb-4">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 top-3 text-sm text-gray-600"
                >
                  {showConfirmPassword ? "Hide" : "View"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                Step 2: OTP Verification
              </h2>
              <input
                type="text"
                name="email_otp"
                placeholder="Enter Email OTP"
                value={formData.email_otp}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                Step 3: Verification Details
              </h2>
              <input
                name="pan_no"
                placeholder="PAN Number"
                value={formData.pan_no}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  className="mr-2"
                />
                Verified Buyer?
              </label>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                Step 4: Account Details
              </h2>
              <input
                name="account_holder_name"
                placeholder="Account Holder Name"
                value={formData.account_holder_name}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                name="account_number"
                placeholder="Account Number"
                value={formData.account_number}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                name="ifsc_code"
                placeholder="IFSC Code"
                value={formData.ifsc_code}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg uppercase"
              />
              <input
                name="wallet_address"
                placeholder="Wallet Address"
                value={formData.wallet_address}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition ml-auto disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Finish"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
