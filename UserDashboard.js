import React, { useState } from "react";
import {
  LogOut,
  ShieldCheck,
  LinkIcon,
  AlertTriangle,
  Menu,
} from "lucide-react";
import ChatbotWidget from "./ChatbotWidget";
import Layout from "./Layout";

const UserDashboard = ({ alerts = [], onLogout }) => {
  const [url, setUrl] = useState("");
  const [phishingResult, setPhishingResult] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [upiResult, setUpiResult] = useState(null);

  const checkPhishing = async () => {
    try {
      const res = await fetch("http://localhost:5000/check-phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setPhishingResult(data.is_phishing ? "🚨 Warning ⚠️ Phishing site!" : "✅ Safe site");
    } catch {
      setPhishingResult("❌ Error checking URL");
    }
  };

  const checkUpi = async () => {
  try {
    const res = await fetch("http://localhost:5000/check-upi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upi_id: upiId }),
    });

    const data = await res.json();

    setUpiResult(data.safe ? "✅ UPI ID is safe" : `🚨 Not Safe: ${data.result}`);
  } catch (err) {
    console.error("UPI Check Error:", err);
    setUpiResult("❌ Error checking UPI ID");
  }
};


  return (
    <Layout>
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-4 bg-black bg-opacity-60 shadow-md rounded-xl mb-6">
        <div className="text-2xl font-bold flex items-center gap-2 tracking-wide text-cyan-400 drop-shadow-lg">
          <Menu className="w-6 h-6" />🛡️ AI-Powered Cybersecurity Dashboard
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded shadow-lg transition-all duration-300"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10 drop-shadow-lg">
        Welcome, User
      </h1>

      {/* Grid layout for phishing + UPI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Phishing Detection */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-white">
            <LinkIcon className="w-6 h-6" /> 🔍 Phishing URL Detection
          </h2>
          <input
            type="text"
            placeholder="https://example.com"
            className="w-full p-3 mb-3 rounded bg-black bg-opacity-30 text-white placeholder-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={checkPhishing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Analyze
          </button>
          {phishingResult && (
            <p className="mt-4 text-center text-lg font-medium">
              {phishingResult.includes("Phishing") ? (
                <span className="text-red-400">{phishingResult}</span>
              ) : (
                <span className="text-green-400">{phishingResult}</span>
              )}
            </p>
          )}
        </div>

        {/* UPI Detection */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-white">
            <ShieldCheck className="w-6 h-6" /> 💳 UPI Fraud Detection
          </h2>
          <input
            type="text"
            placeholder="username@bank"
            className="w-full p-3 mb-3 rounded bg-black bg-opacity-30 text-white placeholder-white"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-3 mb-3 rounded bg-black bg-opacity-30 text-white placeholder-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="datetime-local"
            className="w-full p-3 mb-3 rounded bg-black bg-opacity-30 text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={checkUpi}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
          >
            Check UPI
          </button>
          {upiResult && (
            <p className="mt-4 text-center text-lg font-medium">
              {upiResult.includes("NOT SAFE") ? (
                <span className="text-red-400">{upiResult}</span>
              ) : (
                <span className="text-green-400">{upiResult}</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white/10 backdrop-blur-lg p-6 mt-12 rounded-2xl shadow-xl border border-white/20 w-full max-w-4xl">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-white">
          <AlertTriangle className="w-5 h-5" /> 🚨 Real-time Threat Alerts
        </h2>
        <ul className="list-disc pl-5 text-gray-100 space-y-2">
          {alerts.length > 0 ? (
            alerts.map((a, i) => <li key={i}>{a.message}</li>)
          ) : (
            <li>No alerts available</li>
          )}
        </ul>
      </div>

      {/* ✅ Chatbot Widget (only once) */}
      <ChatbotWidget />
    </Layout>
  );
};

export default UserDashboard;
