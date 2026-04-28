/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15191e",
        mist: "#f5f7f8",
        line: "#dbe1e5",
        teal: "#0f766e",
        coral: "#ee6f57",
        gold: "#d6a84f"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(21, 25, 30, 0.12)"
      }
    }
  },
  plugins: []
};
