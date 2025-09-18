import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = () => {
    if (!formData.emailOrPhone) {
      alert("Please enter email or phone!");
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrPhone);
    const isPhone = /^\d{10}$/.test(formData.emailOrPhone);

    if (!isEmail && !isPhone) {
      alert("Enter a valid email or 10-digit phone number!");
      return;
    }

    alert(`OTP sent to ${formData.emailOrPhone} (demo).`);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (!/^\d{6}$/.test(formData.otp)) {
      alert("OTP must be 6 digits!");
      return;
    }
    alert("OTP verified successfully (demo).");
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      alert("Password must include at least 1 uppercase letter!");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      alert("Password must include at least 1 number!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO: update password in backend
    alert("Password reset successful! Please login with new password.");
    navigate("/login/ngo");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-16">
        <form
          onSubmit={handleResetPassword}
          className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
            Forgot Password
          </h1>

          {/* Step 1: Email or Phone */}
          {step === 1 && (
            <>
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Enter Email or Phone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Send OTP
              </button>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password (min 8 chars, 1 uppercase, 1 number)"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  );
}
