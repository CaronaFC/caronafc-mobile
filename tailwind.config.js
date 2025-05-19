/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
