import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../assets/cyber-bg.jpg"; // Updated image path
import { FcGoogle } from "react-icons/fc";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { token, role } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        onLogin(token, role);
        setSuccess("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate(role === "admin" ? "/admin" : "/dashboard");
        }, 1500);
      }
    } catch (error) {
      setErr(error.response?.data?.message || "❌ Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 via-black to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

      <div className="absolute w-full h-full z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-pink-500 opacity-20 rounded-full animate-pulse-slow blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-blue-500 opacity-20 rounded-full animate-pulse-slow blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500 opacity-10 rounded-full animate-ping blur-2xl" />
      </div>

      <div
        className={`max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transform transition duration-1000 ease-in-out ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } relative z-10`}
      >
        {/* Form Side */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-2"> 🔐 Login</h2>
          <p className="text-sm text-white mb-6">If you have an account, please login 🔑</p>

          {err && (
            <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded mb-4">
              {err}
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-white">📧 Email Address</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-purple-400 px-4 py-2 rounded bg-black/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">⚡Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-purple-400 px-4 py-2 rounded bg-black/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mt-4 text-right text-sm text-purple-300 hover:underline cursor-pointer">
              <Link to="/reset-password">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="my-4 glow-button w-full"
            >
              Log In
            </button>
          </form>

          <div className="my-4 flex items-center justify-between text-white">
            <hr className="w-full border-purple-400" />
            <span className="px-3 text-sm">OR</span>
            <hr className="w-full border-purple-400" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 border border-purple-400 py-2 rounded hover:bg-purple-800/40 transition text-white font-medium">
            <FcGoogle className="text-xl bg-white rounded-full" />
            Login with Google
          </button>

          <p className="mt-6 text-sm text-center text-white">
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-300 hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>

        {/* Image Side (Updated) */}
        <div className="hidden md:block">
          <img
            src={loginImage}
            alt="Cyber-themed login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
