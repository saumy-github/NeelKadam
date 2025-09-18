import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Form field names follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
// Validation helpers
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [userType, setUserType] = useState("ngo");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    email_otp: "",
    phone_otp: "",
    ngo_name: "",
    license_no: "",
    spokesperson_name: "",
    spokesperson_mobile: "",
    pan_no: "",
    account_holder_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc_code: "",
    branch: "",
    zila_id_ward_no: "",
    address: "",
    contact_email: "",
    contact_phone: "",
    community_name: "",
    community_spokesperson_name: "",
    community_spokesperson_mobile: "",
    community_verification: "",
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
      if (formData.password !== formData.confirm_password) {
        alert("Passwords do not match!");
        return;
      }
    }

    if (step === 2) {
      if (!/^\d{6}$/.test(formData.email_otp)) {
        alert("Email OTP must be 6 digits!");
        return;
      }
      if (!/^\d{6}$/.test(formData.phone_otp)) {
        alert("Phone OTP must be 6 digits!");
        return;
      }
    }

    if (step === 4) {
      if (formData.account_number !== formData.confirm_account_number) {
        alert("Account numbers do not match!");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Form submitted with data:", formData);
    console.log("📝 Selected user type:", userType);

    try {
      // Add any final validation checks
      if (formData.account_number !== formData.confirm_account_number) {
        console.error("❌ Account numbers don't match");
        alert("Account numbers do not match!");
        return;
      }

      if (formData.password !== formData.confirm_password) {
        console.error("❌ Passwords don't match");
        alert("Passwords do not match!");
        return;
      }

      console.log("🔄 Preparing data for API submission...");

      // Prepare the appropriate data object based on user type
      let apiData = {};
      let apiEndpoint = "";

      if (userType === "ngo") {
        apiData = {
          license_no: formData.license_no,
          ngo_name: formData.ngo_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          spokesperson_name: formData.spokesperson_name,
          spokesperson_mobile: formData.spokesperson_mobile,
          pan_no: formData.pan_no,
          account_holder_name: formData.account_holder_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
        };
        apiEndpoint = "http://localhost:3000/api/auth/ngo/register";
      } else if (userType === "panchayat") {
        apiData = {
          zila_id_ward_no: formData.zila_id_ward_no,
          address: formData.address,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || formData.contact_phone,
          pan_no: formData.pan_no,
          account_holder_name: formData.account_holder_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
        };
        apiEndpoint = "http://localhost:3000/api/auth/panchayat/register";
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
        };
        apiEndpoint = "http://localhost:3000/api/auth/community/register";
      }

      console.log(`🚀 Sending ${userType} data to API:`, apiData);
      console.log(`🌐 Using endpoint: ${apiEndpoint}`);

      // Make the API call
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();
      console.log("📥 API response:", data);

      if (!response.ok) {
        // Detailed error logging
        console.error("❌ API error response:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(
          data.error || data.message || `${userType} registration failed`
        );
      }

      console.log("✅ Registration successful!");
      alert(`${userType.toUpperCase()} account created successfully!`);

      // Redirect to the appropriate login page
      navigate(`/login/${userType.toLowerCase()}`);
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert("Registration failed: " + error.message);
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
            Sign Up
          </h1>

          {/* ✅ Progress Bar */}
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
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
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
                name="email_otp"
                placeholder="Enter Email OTP"
                value={formData.email_otp}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                type="text"
                name="phone_otp"
                placeholder="Enter Phone OTP"
                value={formData.phone_otp}
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
                  <input
                    name="community_verification"
                    placeholder="Further Verification (initially unverified)"
                    value={formData.community_verification}
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
                name="confirm_account_number"
                placeholder="Confirm Account Number"
                value={formData.confirm_account_number}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg"
              />
              <input
                name="ifsc_code"
                placeholder="IFSC Code"
                value={formData.ifsc_code}
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
