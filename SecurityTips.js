// src/components/SecurityTips.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SecurityTips = () => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/security-tips", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTips(res.data);
      } catch (err) {
        console.error("Error fetching tips:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
        }
      }
    };
    fetchTips();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Security Tips</h2>
      {tips.length === 0 ? (
        <p className="text-gray-500">No tips available.</p>
      ) : (
        <ul className="space-y-3">
          {tips.map((tip, idx) => (
            <li
              key={idx}
              className="p-4 border border-gray-300 rounded-md shadow-sm bg-white text-black"
            >
              ✅ {tip.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SecurityTips;
