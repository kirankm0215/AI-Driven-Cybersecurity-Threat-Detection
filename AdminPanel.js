import React from "react";

export default function AdminPanel({ onLogout }) {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email") || "admin@email.com";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Panel
          </h1>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Logged in as: <span className="font-medium">{email}</span> ({role})
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Total Users</h2>
            <p className="text-4xl font-bold">25</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Pending Alerts</h2>
            <p className="text-4xl font-bold">5</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Resolved Cases</h2>
            <p className="text-4xl font-bold">18</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>
          <div className="bg-white border border-gray-200 rounded shadow p-6">
            <p className="text-gray-600">
              This section will show a table of users, roles, and actions like suspend or delete.
            </p>
            <p className="text-gray-500 mt-2">
              (You can build this with a table and CRUD actions later!)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
