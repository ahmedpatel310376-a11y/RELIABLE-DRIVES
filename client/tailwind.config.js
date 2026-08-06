/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#06182f",
        electric: "#1677ff",
        ink: "#081a30",
        mist: "#f4f7fc",
        line: "#d9e4f1",
        teal: "#1677ff",
        coral: "#0066ff",
        gold: "#69a8ff"
      },
      boxShadow: {
        soft: "0 22px 70px rgba(6, 24, 47, 0.12)",
        glow: "0 18px 60px rgba(22, 119, 255, 0.28)"
      }
    }
  },
  plugins: []
};
