// src/components/VerifyOTP.js
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        setMessage("✅ OTP verified! Registration complete.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.data.message || "❌ OTP verification failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error verifying OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl w-full max-w-md shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Verify OTP</h2>

        {message && (
          <div className="bg-green-500 text-sm px-4 py-2 mb-4 rounded">{message}</div>
        )}
        {error && (
          <div className="bg-red-500 text-sm px-4 py-2 mb-4 rounded">{error}</div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-purple-700 font-bold py-2 rounded-lg"
          >
            🔐 Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
