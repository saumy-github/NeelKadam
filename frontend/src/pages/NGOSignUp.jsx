import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Validation helpers
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [userType, setUserType] = useState("ngo");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emailOtp: "",
    phoneOtp: "",
    ngoName: "",
    licenseNo: "",
    spokespersonName: "",
    spokespersonMobile: "",
    panNo: "",
    accountHolder: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    branch: "",
    zilaId: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    communityDetails: "",
    communitySpokesperson: "",
    communityMobile: "",
    communityVerification: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateEmail(formData.email)) {
        alert("Invalid email format!");
        return;
      }
      if (!validatePhone(formData.phone)) {
        alert("Phone must be 10 digits!");
        return;
      }
      if (!validatePassword(formData.password)) {
        alert(
          "Password must be 8+ chars, include uppercase, lowercase, number & special char."
        );
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }

    if (step === 2) {
      if (!/^\d{6}$/.test(formData.emailOtp)) {
        alert("Email OTP must be 6 digits!");
        return;
      }
      if (!/^\d{6}$/.test(formData.phoneOtp)) {
        alert("Phone OTP must be 6 digits!");
        return;
      }
    }

    if (step === 4) {
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        alert("Account numbers do not match!");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signup successful!");
    navigate("/login/ngo");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-10 w-full max-w-2xl border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
            Sign Up
          </h1>

          {/* ✅ Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

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
              <input
                type="tel"
                name="phone"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
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
                name="emailOtp"
                placeholder="Enter Email OTP"
                value={formData.emailOtp}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                type="text"
                name="phoneOtp"
                placeholder="Enter Phone OTP"
                value={formData.phoneOtp}
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
                    name="ngoName"
                    placeholder="NGO Name"
                    value={formData.ngoName}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="licenseNo"
                    placeholder="License No."
                    value={formData.licenseNo}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="spokespersonName"
                    placeholder="Spokesperson Name"
                    value={formData.spokespersonName}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="spokespersonMobile"
                    placeholder="Spokesperson Mobile"
                    value={formData.spokespersonMobile}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="panNo"
                    placeholder="PAN No."
                    value={formData.panNo}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                </>
              )}

              {userType === "panchayat" && (
                <>
                  <input
                    name="zilaId"
                    placeholder="Zila ID / Ward No."
                    value={formData.zilaId}
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
                    name="contactEmail"
                    placeholder="Contact Email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="contactPhone"
                    placeholder="Contact Phone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                </>
              )}

              {userType === "community" && (
                <>
                  <input
                    name="communityDetails"
                    placeholder="Community Details"
                    value={formData.communityDetails}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="communitySpokesperson"
                    placeholder="Spokesperson Name"
                    value={formData.communitySpokesperson}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="communityMobile"
                    placeholder="Spokesperson Mobile"
                    value={formData.communityMobile}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg"
                  />
                  <input
                    name="communityVerification"
                    placeholder="Further Verification (initially unverified)"
                    value={formData.communityVerification}
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
                name="accountHolder"
                placeholder="Account Holder Name"
                value={formData.accountHolder}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                name="confirmAccountNumber"
                placeholder="Confirm Account Number"
                value={formData.confirmAccountNumber}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                name="ifsc"
                placeholder="IFSC Code"
                value={formData.ifsc}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                name="branch"
                placeholder="Branch Name (auto-fetch via IFSC)"
                value={formData.branch}
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
