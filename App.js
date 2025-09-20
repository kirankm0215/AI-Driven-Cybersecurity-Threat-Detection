import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// 👉 Pages
import Login from "./components/Login";
import Register from "./components/Register";
import VerifyOTP from "./components/VerifyOTP";
import Dashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Alerts from "./components/Alerts";
import UsersManagement from "./components/UsersManagement";
import ThreatChart from "./components/ThreatChart";
import SecurityTips from "./components/SecurityTips";
import ResetPassword from "./components/ResetPassword"; 
import MFASetup from "./components/MFASetup";
import ChatbotWidget from "./components/ChatbotWidget"; 
import DetectUPIFraud from "./components/DetectUpiFraud";
import Layout from "./components/Layout"; // ✅ Layout included
import OAuthSuccess from './components/OAuthSuccess';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchAlerts();
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  const handleLogin = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setToken(null);
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={token ? <Navigate to={role === "admin" ? "/admin" : "/dashboard"} /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        {/* Protected Routes with Layout */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Layout>
                <Dashboard onLogout={handleLogout} alerts={alerts} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            token && role === "admin" ? (
              <Layout>
                <AdminDashboard onLogout={handleLogout} alerts={alerts} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/alerts"
          element={
            token ? (
              <Layout>
                <Alerts alerts={alerts} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/users"
          element={
            token && role === "admin" ? (
              <Layout>
                <UsersManagement />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/threat-chart"
          element={
            token && role === "admin" ? (
              <Layout>
                <ThreatChart />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/security-tips"
          element={
            token ? (
              <Layout>
                <SecurityTips />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/mfa"
          element={
            token ? (
              <Layout>
                <MFASetup />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/detect-upi"
          element={
            token ? (
              <Layout>
                <DetectUPIFraud />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            token ? (
              <Navigate to={role === "admin" ? "/admin" : "/dashboard"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      {/* ✅ Global Chatbot */}
      {token && <ChatbotWidget />}
    </Router>
  );
};

export default App;
