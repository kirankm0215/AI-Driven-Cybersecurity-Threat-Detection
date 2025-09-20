import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registerImage from "../assets/register-image.jpg";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("user");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/register`, {
        email,
        password,
        role,
      });

      if (res.status === 200) {
        alert("OTP sent to your email");
        navigate("/verify-otp", { state: { email } });
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });

      if (res.status === 200) {
        alert("Registered successfully! Please login.");
        navigate("/login");
      } else {
        setError(res.data.msg || "OTP verification failed.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "OTP verification error.");
    }
  };
const googleLogin = () => {
  window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: "<YOUR_GOOGLE_CLIENT_ID>",
      redirect_uri: "http://localhost:5000/auth/callback/google",
      response_type: "code",
      scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      access_type: "offline",
      prompt: "consent"
    });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* Left Form */}
        <div className="p-10 flex flex-col justify-center items-center text-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-2 text-center">📝 Register</h2>
            <p className="text-sm text-gray-300 mb-6 text-center">Create a new account</p>

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
                <label className="block text-sm mb-1 text-white">⚡ Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-purple-400 px-4 py-2 rounded bg-black/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">👍 Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-white/30 rounded-md bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user" className="text-black">User</option>
                <option value="admin" className="text-black">Admin</option>
              </select>

              {showOtp && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border border-white/30 rounded-md bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              {showOtp ? (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="my-4 glow-button w-full"
                >
                  ✅ Verify OTP
                </button>
              ) : (
                <button
                  type="submit"
                  className="my-4 glow-button w-full"
                >
                  🚀 Register
                </button>
              )}
            </form>

            {/* Social Login Buttons */}
            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-cyan-300">or register with</p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://accounts.google.com/o/oauth2/v2/auth?client_id=1234567890-abc123def456.apps.googleusercontent.com&redirect_uri=http://localhost:5000/auth/google/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent"
                  className="flex items-center px-4 py-2 border border-cyan-500 rounded-md text-white hover:bg-cyan-600 transition"
                >
                  <FaGoogle className="mr-2" /> Google
                </a>
                <a
                  href="https://github.com/login/oauth/authorize?client_id=...&redirect_uri=http://localhost:5000/auth/github/callback&state=abcd1234"
                  className="flex items-center px-4 py-2 border border-cyan-500 rounded-md text-white hover:bg-cyan-600 transition"
                >
                  <FaGithub className="mr-2" /> GitHub
                </a>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Already registered?{" "}
              <span
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden md:block">
          <img
            src={registerImage}
            alt="Register"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
