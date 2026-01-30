/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark Theme
        dark: {
          900: "#0D0D0D",
          800: "#141414",
          700: "#1A1A1A",
          600: "#222222",
          500: "#2A2A2A",
          400: "#333333",
          300: "#404040",
        },
        // Green Accents
        accent: {
          primary: "#00FF87",
          secondary: "#00D170",
          dark: "#00A855",
          light: "#4DFFAB",
        },
        // Text
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
          muted: "#808080",
        },
        // Semantic
        success: "#00FF87",
        error: "#FF4757",
        warning: "#FFD93D",
        info: "#00D4FF",
        // Legacy (keep for compatibility)
        primaryWhite: "#FFFFFF",
        secondaryWhite: "#F8F8F8",
        labelColor: "#22215B",
        inputColor: "#F2F3F3",
        primaryBlack: "#000000",
        primaryGray: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
