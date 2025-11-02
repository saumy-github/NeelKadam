import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email_or_phone: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = () => {
    if (!formData.email_or_phone) {
      alert("Please enter email or phone!");
      return;
    }
    const isEmail = /\S+@\S+\.\S+/.test(formData.email_or_phone);
    const isPhone = /^\d{10}$/.test(formData.email_or_phone);
    if (!isEmail && !isPhone) {
      alert("Enter a valid email or 10-digit phone number!");
      return;
    }
    alert(`OTP sent to ${formData.email_or_phone} (demo).`);
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
    const { new_password, confirm_password } = formData;
    if (new_password.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    if (!/[A-Z]/.test(new_password)) {
      alert("Password must include at least 1 uppercase letter!");
      return;
    }
    if (!/[0-9]/.test(new_password)) {
      alert("Password must include at least 1 number!");
      return;
    }
    if (new_password !== confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successful! Please login with new password.");
    navigate("/login/ngo");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <main className="flex-grow flex justify-center items-start pt-16 px-6 sm:px-12">
        <form
          onSubmit={handleResetPassword}
          className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-md border border-gray-300 animate-fade-in"
        >
          <h1 className="text-4xl font-bold text-center mb-10 text-green-700 drop-shadow">
            Forgot Password
          </h1>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <input
                type="text"
                name="email_or_phone"
                placeholder="Enter Email or Phone"
                value={formData.email_or_phone}
                onChange={handleChange}
                className="w-full p-4 mb-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-green-700 text-white py-4 rounded-xl font-semibold hover:bg-green-800 transition"
              >
                Send OTP
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-4 mb-8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                required
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-green-700 text-white py-4 rounded-xl font-semibold hover:bg-green-800 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <input
                type="password"
                name="new_password"
                placeholder="New Password (min 8 chars, 1 uppercase, 1 number)"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full p-4 mb-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                required
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm New Password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full p-4 mb-8 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-4 rounded-xl font-semibold hover:bg-green-800 transition"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  );
};
