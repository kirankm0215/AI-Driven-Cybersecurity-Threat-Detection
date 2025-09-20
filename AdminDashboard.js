// ✅ src/components/AdminDashboard.js
import React from "react";
import { BarChart, Users, ShieldAlert, ServerCog } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Line } from "recharts";

const threatData = [
  { day: "Mon", phishing: 4, upi: 2 },
  { day: "Tue", phishing: 7, upi: 5 },
  { day: "Wed", phishing: 3, upi: 1 },
  { day: "Thu", phishing: 6, upi: 4 },
  { day: "Fri", phishing: 2, upi: 3 },
];

const AdminDashboard = ({ onLogout, alerts = [] }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <BarChart className="text-blue-600" /> Threat Stats (Last 5 Days)
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={threatData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="phishing" fill="#8884d8" name="Phishing" />
              <Bar dataKey="upi" fill="#82ca9d" name="UPI Fraud" />
              <Line type="monotone" dataKey="phishing" stroke="#8884d8" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <ShieldAlert className="text-red-500" /> Latest Alerts
          </div>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {alerts.length ? alerts.slice(0, 5).map((a, i) => (
              <li key={i}>{a.message}</li>
            )) : <li>No alerts found.</li>}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Users className="text-purple-600" /> User Stats
          </div>
          <p className="text-sm">👥 Total Users: 128<br />🛡️ Admins: 4<br />🔒 MFA Enabled: 87%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <ServerCog className="text-gray-600" /> AI Models
          </div>
          <p className="text-sm">✅ Phishing Model v1.3 (92.1% accuracy)<br />✅ UPI Fraud Model v2.1 (90.7%)<br />📅 Last Trained: 7 days ago</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
