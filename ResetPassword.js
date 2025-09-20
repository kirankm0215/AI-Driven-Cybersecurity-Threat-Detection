// src/components/ResetPassword.js
import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const requestOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/request-reset", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage("Failed to send OTP.");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verify-reset", {
        email,
        otp,
        new_password: newPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Invalid OTP or server error.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Reset Password</h2>
      {step === 1 ? (
        <>
          <label className="block mb-2">Enter your email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            onClick={requestOTP}
          >
            Request OTP
          </button>
        </>
      ) : (
        <>
          <label className="block mb-2">Enter OTP</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <label className="block mb-2">Enter New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            onClick={verifyOTP}
          >
            Reset Password
          </button>
        </>
      )}
      {message && <p className="text-sm text-center text-gray-700 mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
