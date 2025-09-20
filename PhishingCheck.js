import React, { useState } from "react";
import axios from "axios";

const PhishingCheck = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/check-phishing", { url });
      setResult(response.data.is_phishing ? "⚠️ Phishing Detected!" : "✅ Safe URL");
    } catch (error) {
      console.error("Error checking phishing:", error);
      setResult("❌ Error checking URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-4">Check Phishing URL</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        className="p-2 rounded-md w-72 text-black mb-4"
      />
      <button
        onClick={checkPhishing}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check"}
      </button>
      {result && <p className="mt-4 text-lg font-medium">{result}</p>}
    </div>
  );
};

export default PhishingCheck;

