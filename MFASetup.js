// src/components/MFASetup.js
import React, { useState } from 'react';
import axios from 'axios';

const MFASetup = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/verify-mfa", { otp }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Invalid OTP or error verifying MFA.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">MFA Verification</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-3"
      />
      <button
        onClick={handleVerify}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Verify OTP
      </button>
      {message && <p className="mt-3 text-sm text-center">{message}</p>}
    </div>
  );
};

export default MFASetup;
