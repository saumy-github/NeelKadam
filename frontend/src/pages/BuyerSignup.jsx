import apiClient from "../api/config.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectMetaMask, isMetaMaskInstalled } from "../utils/metamask";

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
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [error, setError] = useState("");

  // Password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Connect MetaMask and populate wallet address
  const handleConnectWallet = async () => {
    setError("");
    setIsConnectingWallet(true);
    
    try {
      if (!isMetaMaskInstalled()) {
        throw new Error("Please install MetaMask extension first.");
      }

      const walletAddress = await connectMetaMask();
      
      // Auto-populate the wallet address field
      setFormData((prev) => ({ 
        ...prev, 
        wallet_address: walletAddress 
      }));
      
      alert(`MetaMask connected successfully!\nWallet Address: ${walletAddress}`);
    } catch (err) {
      setError(err.message || "Failed to connect MetaMask");
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirm_password) return;
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
      const response = await apiClient.post("/api/auth/buyer/register", formData);
      console.log("✅ Registration successful:", response.data);
      navigate("/login/buyer");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something went wrong. Please try again.";
      console.error("❌ Error during registration:", errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <main className="flex-grow flex justify-center items-start pt-14 px-6 sm:px-12">
        <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-3xl border border-gray-200 animate-fade-in">
          <h1 className="text-4xl font-bold text-center mb-10 text-green-700 drop-shadow">
            Buyer Sign Up
          </h1>

          {/* Error display */}
          {error && (
            <p className="mb-6 text-red-600 text-center font-semibold">{error}</p>
          )}

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between text-base text-gray-700 mb-3">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <input
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-4 text-green-600 font-medium hover:text-green-700"
                >
                  {showPassword ? "Hide" : "View"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-4 top-4 text-green-600 font-medium hover:text-green-700"
                >
                  {showConfirmPassword ? "Hide" : "View"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <input
                type="text"
                name="email_otp"
                placeholder="Enter Email OTP"
                value={formData.email_otp}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <input
                name="pan_no"
                placeholder="PAN Number"
                value={formData.pan_no}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <label className="inline-flex items-center mt-4 space-x-2">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700 font-semibold">Verified Buyer?</span>
              </label>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-6">
              <input
                name="account_holder_name"
                placeholder="Account Holder Name"
                value={formData.account_holder_name}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <input
                name="account_number"
                placeholder="Account Number"
                value={formData.account_number}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <input
                name="ifsc_code"
                placeholder="IFSC Code"
                value={formData.ifsc_code}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase text-lg"
              />
              
              {/* MetaMask Connection Section */}
              <div className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <label className="block text-gray-700 font-semibold mb-2">
                  MetaMask Wallet Address *
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Connect your MetaMask wallet to auto-fill your wallet address. 
                  This address will be used for all blockchain transactions.
                </p>
                <button
                  type="button"
                  onClick={handleConnectWallet}
                  disabled={isConnectingWallet}
                  className="w-full mb-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isConnectingWallet ? "Connecting..." : formData.wallet_address ? "🦊 Reconnect MetaMask" : "🦊 Connect MetaMask"}
                </button>
                <input
                  name="wallet_address"
                  placeholder="Wallet Address (auto-filled after connecting MetaMask)"
                  value={formData.wallet_address}
                  onChange={handleChange}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
                />
                {formData.wallet_address && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ Wallet connected successfully
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                className="px-8 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 transition font-semibold text-lg"
              >
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition font-semibold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="ml-auto px-8 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition font-semibold text-lg disabled:opacity-70"
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
