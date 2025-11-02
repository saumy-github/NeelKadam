import apiClient from "../api/config.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectMetaMask, isMetaMaskInstalled } from "../utils/metamask";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [userType, setUserType] = useState("ngo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    email_otp: "",
    ngo_name: "",
    license_no: "",
    spokesperson_name: "",
    spokesperson_mobile: "",
    pan_no: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    wallet_address: "",
    zila_id_ward_no: "",
    address: "",
    contact_email: "",
    community_name: "",
    community_spokesperson_name: "",
    community_spokesperson_mobile: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

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

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!formData.email) {
        setError("Email is required.");
        return;
      }
      if (formData.password !== formData.confirm_password) {
        setError("Passwords do not match.");
        return;
      }
    }
    if (step === 2 && !formData.email_otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (
      !formData.account_holder_name ||
      !formData.account_number ||
      !formData.ifsc_code ||
      !formData.wallet_address
    ) {
      setError("All bank details and wallet address are required.");
      setLoading(false);
      return;
    }
    try {
      let apiData = {};
      let apiEndpoint = "";
      if (userType === "ngo") {
        apiData = {
          license_no: formData.license_no,
          ngo_name: formData.ngo_name,
          email: formData.email,
          password: formData.password,
          spokesperson_name: formData.spokesperson_name,
          spokesperson_mobile: formData.spokesperson_mobile,
          pan_no: formData.pan_no,
          account_holder_name: formData.account_holder_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          wallet_address: formData.wallet_address,
        };
        apiEndpoint = "/api/auth/ngo/register";
      } else if (userType === "panchayat") {
        apiData = {
          zila_id_ward_no: formData.zila_id_ward_no,
          address: formData.address,
          email: formData.email,
          password: formData.password,
          pan_no: formData.pan_no,
          account_holder_name: formData.account_holder_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          wallet_address: formData.wallet_address,
        };
        apiEndpoint = "/api/auth/panchayat/register";
      } else {
        apiData = {
          community_name: formData.community_name,
          spokesperson_name: formData.community_spokesperson_name,
          spokesperson_mobile: formData.community_spokesperson_mobile,
          email: formData.email,
          password: formData.password,
          pan_no: formData.pan_no,
          account_holder_name: formData.account_holder_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          wallet_address: formData.wallet_address,
        };
        apiEndpoint = "/api/auth/community/register";
      }
      await apiClient.post(apiEndpoint, apiData);
      navigate(`/login/${userType}`, { state: { success: true } });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <main className="flex-grow flex justify-center items-start pt-16 px-6 sm:px-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-3xl border border-gray-200 animate-fade-in"
        >
          <h1 className="text-4xl font-bold text-center mb-10 text-green-700 drop-shadow">
            Seller Sign Up
          </h1>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between text-base text-gray-700 mb-3">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden shadow-sm">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-6 text-red-600 text-center font-semibold">{error}</p>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute top-4 right-4 text-green-600 font-medium hover:text-green-700"
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
                  className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute top-4 right-4 text-green-600 font-medium hover:text-green-700"
                >
                  {showConfirmPassword ? "Hide" : "View"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <p className="font-medium text-gray-800 mb-4">Enter the OTP sent to your Email:</p>
              <input
                type="text"
                name="email_otp"
                placeholder="Enter Email OTP"
                value={formData.email_otp}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">Step 3: Seller Details</h2>

              {userType === "ngo" && (
                <>
                  <input
                    name="ngo_name"
                    placeholder="Seller Name"
                    value={formData.ngo_name}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    name="license_no"
                    placeholder="License No."
                    value={formData.license_no}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    name="spokesperson_name"
                    placeholder="Spokesperson Name"
                    value={formData.spokesperson_name}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    type="tel"
                    name="spokesperson_mobile"
                    placeholder="Spokesperson Mobile"
                    value={formData.spokesperson_mobile}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    name="pan_no"
                    placeholder="PAN No."
                    value={formData.pan_no}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                </>
              )}

              {userType === "panchayat" && (
                <>
                  <input
                    name="zila_id_ward_no"
                    placeholder="Zila ID / Ward No."
                    value={formData.zila_id_ward_no}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    type="email"
                    name="contact_email"
                    placeholder="Contact Email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    type="tel"
                    name="contact_phone"
                    placeholder="Contact Phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                </>
              )}

              {userType === "community" && (
                <>
                  <input
                    name="community_name"
                    placeholder="Community Name"
                    value={formData.community_name}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    name="community_spokesperson_name"
                    placeholder="Spokesperson Name"
                    value={formData.community_spokesperson_name}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                  <input
                    type="tel"
                    name="community_spokesperson_mobile"
                    placeholder="Spokesperson Mobile"
                    value={formData.community_spokesperson_mobile}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                  />
                </>
              )}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                Step 4: Bank Details & MetaMask Wallet
              </h2>
              <input
                name="account_holder_name"
                placeholder="Account Holder Name"
                value={formData.account_holder_name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <input
                name="account_number"
                placeholder="Account Number"
                value={formData.account_number}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              />
              <input
                name="ifsc_code"
                placeholder="IFSC Code"
                value={formData.ifsc_code}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase text-lg"
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
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition font-semibold text-lg disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Finish"}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
