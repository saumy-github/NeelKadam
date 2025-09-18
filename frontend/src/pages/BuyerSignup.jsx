import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Validation helpers
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password) =>
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
const validateAccountNumber = (acc) => /^[0-9]{9,18}$/.test(acc);
const validateIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

export default function BuyerSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    buyer_id: "",
    company_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emailOtp: "",
    phoneOtp: "",
    pan_no: "",
    wallet_address: "",
    is_verified: false,
    account_holder_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch_name: "",
    total_cc: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateEmail(formData.email)) {
        alert("Invalid email format!");
        return;
      }
      if (!validatePassword(formData.password)) {
        alert("Password must be 8+ chars, include number & special character.");
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

    if (step === 3) {
      if (!validatePAN(formData.pan_no)) {
        alert("Invalid PAN number format (e.g., ABCDE1234F)!");
        return;
      }
    }

    if (step === 4) {
      if (!validateAccountNumber(formData.account_number)) {
        alert("Account number must be 9–18 digits!");
        return;
      }
      if (formData.account_number !== formData.confirm_account_number) {
        alert("Account numbers do not match!");
        return;
      }
    }

    if (step === 5) {
      if (!validateIFSC(formData.ifsc_code)) {
        alert("Invalid IFSC code (e.g., HDFC0001234)!");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Buyer Account Created Successfully!");
    navigate("/login/buyer");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-10 w-full max-w-2xl border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
            Buyer Sign Up
          </h1>

          {/* Progress Bar */}
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

          {/* Step 1: Account Setup */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">Step 1: Account Setup</h2>
              <input name="buyer_id" placeholder="Buyer ID" value={formData.buyer_id} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input name="company_name" placeholder="Company Name" value={formData.company_name} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input type="tel" name="phone" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">Step 2: OTP Verification</h2>
              <input type="text" name="emailOtp" placeholder="Enter Email OTP" value={formData.emailOtp} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input type="text" name="phoneOtp" placeholder="Enter Phone OTP" value={formData.phoneOtp} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
            </div>
          )}

          {/* Step 3: Verification Details */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">Step 3: Verification Details</h2>
              <input name="pan_no" placeholder="PAN Number (e.g., ABCDE1234F)" value={formData.pan_no} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg uppercase" />
              <input name="wallet_address" placeholder="Wallet Address" value={formData.wallet_address} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <label className="flex items-center mb-4">
                <input type="checkbox" name="is_verified" checked={formData.is_verified} onChange={handleChange} className="mr-2" />
                Verified Buyer?
              </label>
            </div>
          )}

          {/* Step 4: Account Details */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">Step 4: Account Details</h2>
              <input name="account_holder_name" placeholder="Account Holder Name" value={formData.account_holder_name} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input name="account_number" placeholder="Account Number" value={formData.account_number} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input name="confirm_account_number" placeholder="Confirm Account Number" value={formData.confirm_account_number} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
            </div>
          )}

          {/* Step 5: Bank Details */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">Step 5: Bank Details</h2>
              <input name="bank_name" placeholder="Bank Name" value={formData.bank_name} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input name="branch_name" placeholder="Branch Name" value={formData.branch_name} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
              <input name="ifsc_code" placeholder="IFSC Code" value={formData.ifsc_code} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg uppercase" />
              <input type="number" name="total_cc" placeholder="Total CC" value={formData.total_cc} onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button type="button" onClick={() => setStep((prev) => prev - 1)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button type="button" onClick={handleNext} className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition ml-auto">
                Next
              </button>
            ) : (
              <button type="submit" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition ml-auto">
                Submit
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
