import { useState } from "react";

export default function Login() {
  const [role, setRole] = useState(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          🌍 Blue Carbon Registry Login
        </h1>

        {!role ? (
          <>
            <p className="text-gray-600 text-center mb-4">
              Please choose your role:
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setRole("NGO")}
                className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                NGO Login
              </button>
              <button
                onClick={() => setRole("Buyer")}
                className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Buyer Login
              </button>
              <button
                onClick={() => setRole("Admin")}
                className="py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-black transition"
              >
                Admin Login
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              {role} Access
            </h2>
            <div className="flex flex-col gap-4">
              <button className="py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Sign In
              </button>
              <button className="py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                Sign Up
              </button>
              <button
                onClick={() => setRole(null)}
                className="py-2 px-4 text-sm text-gray-600 underline hover:text-gray-800"
              >
                ← Go Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
