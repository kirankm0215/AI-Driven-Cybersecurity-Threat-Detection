import React from "react";

export default function Alerts({ alerts = [] }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Security Alerts</h1>

        {alerts.length === 0 ? (
          <p className="text-gray-600">No alerts to display. All clear! 🎉</p>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="border-l-4 border-red-500 bg-red-50 p-4 rounded shadow-sm"
              >
                <h2 className="text-lg font-semibold text-red-700">
                  {alert.type || "Unknown Alert"}
                </h2>
                <p className="text-gray-700">{alert.message}</p>
                <p className="text-sm text-gray-500 mt-1">{alert.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
