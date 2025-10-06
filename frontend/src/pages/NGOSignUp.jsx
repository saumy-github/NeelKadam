import apiClient from "../api/config.js";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [userType, setUserType] = useState("ngo");
  const [error, setError] = useState("");

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

  // Removed OTP method selection, only email OTP is used

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setError(""); // clear error

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

    if (step === 2) {
      if (!formData.email_otp) {
        setError("Please enter the OTP sent to your email.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ validate Step 4 fields before sending to backend
    if (
      !formData.account_holder_name ||
      !formData.account_number ||
      !formData.ifsc_code ||
      !formData.wallet_address
    ) {
      setError("All bank details and wallet address are required.");
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
        apiEndpoint = "/auth/ngo/register";
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
        apiEndpoint = "/auth/panchayat/register";
      } else if (userType === "community") {
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
        apiEndpoint = "/auth/community/register";
      }

      // Use the apiClient to make the request
      await apiClient.post(apiEndpoint, apiData); // <-- New apiClient call

      navigate(`/login/${userType}`, { state: { success: true } });
    } catch (err) {
      // <-- New error handling
      const errorMessage = err.response?.data?.error || "Registration failed";
      console.error("❌ Error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-10 w-full max-w-2xl border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
            Seller Sign Up
          </h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
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

          {/* Error message */}
          {error && (
            <p className="mb-4 text-red-600 text-sm font-medium">{error}</p>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                Step 1: Account Setup
              </h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />

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
              <p className="font-medium text-gray-700 mb-2">
                Enter the OTP sent to your Email:
              </p>
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
                Step 3: Organization / Community Details
              </h2>
              <select
                name="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full p-3 mb-6 border rounded-lg"
              >
                <option value="ngo">NGO</option>
                <option value="panchayat">Coastal Panchayat</option>
                <option value="community">Community</option>
              </select>

              {userType === "ngo" && (
                <>
                  <input
                    name="ngo_name"
                    placeholder="NGO Name"
                    value={formData.ngo_name}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="license_no"
                    placeholder="License No."
                    value={formData.license_no}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="spokesperson_name"
                    placeholder="Spokesperson Name"
                    value={formData.spokesperson_name}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="spokesperson_mobile"
                    placeholder="Spokesperson Mobile"
                    value={formData.spokesperson_mobile}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="pan_no"
                    placeholder="PAN No."
                    value={formData.pan_no}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
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
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    type="email"
                    name="contact_email"
                    placeholder="Contact Email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="contact_phone"
                    placeholder="Contact Phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
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
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="community_spokesperson_name"
                    placeholder="Spokesperson Name"
                    value={formData.community_spokesperson_name}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="community_spokesperson_mobile"
                    placeholder="Spokesperson Mobile"
                    value={formData.community_spokesperson_mobile}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                </>
              )}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                Step 4: Bank Details
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
                onClick={() => setStep((prev) => prev - 1)}
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
                type="submit"
                className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition ml-auto"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
