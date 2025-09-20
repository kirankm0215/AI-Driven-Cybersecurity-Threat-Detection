import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function ThreatChart() {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Phishing Attempts",
        data: [3, 5, 8, 2, 6, 10],
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.2,
      },
      {
        label: "UPI Fraud Attempts",
        data: [1, 2, 3, 2, 4, 5],
        fill: false,
        borderColor: "#ef4444",
        tension: 0.2,
      },
    ],
  };

  const pieData = {
    labels: ["Phishing", "UPI Fraud"],
    datasets: [
      {
        label: "Threats",
        data: [60, 40],
        backgroundColor: ["#3b82f6", "#ef4444"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Threat Trends & Analysis
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded shadow border">
            <h2 className="text-xl font-semibold mb-4">Monthly Threats</h2>
            <Line data={lineData} />
          </div>

          <div className="bg-white p-4 rounded shadow border">
            <h2 className="text-xl font-semibold mb-4">Threat Share</h2>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
