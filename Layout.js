// src/components/Layout.js
import React from "react";
import bg from "../assets/dash-bg.jpg"; // Ensure correct path

const Layout = ({ children }) => {
  return (
    <div
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat relative text-white font-sans"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-xl z-0" />

      {/* Centering Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
