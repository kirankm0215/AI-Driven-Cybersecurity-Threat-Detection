// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0f1117',
        'cyber-primary': '#00ffff',
        'cyber-light': '#b0bec5',
        cyber: {
          primary: "#00ffff",
          dark: "#0a0d13",
          light: "#0ff",
        },
      },
      fontFamily: {
        cyber: ['"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        neon: "0 0 10px #0ff, 0 0 20px #0ff",
        glow: "0 0 15px rgba(0, 255, 255, 0.7)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        fadeInRight: "fadeInRight 0.3s ease-out",
        fadeInLeft: "fadeInLeft 0.3s ease-out",
        "pulse-sm": "pulse 3s infinite",
        fadeIn: 'fadeIn 3s ease-out forwards',
        slideUp: 'slideUp 1.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInRight: {
          from: { opacity: 0, transform: "translateX(20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        fadeInLeft: {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(50px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

