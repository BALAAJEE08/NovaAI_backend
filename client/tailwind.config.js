export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nova: {
          50: "#eef6ff",
          500: "#5b8cff",
          600: "#476fe6",
          900: "#172033"
        },
        ink: "#101216",
        mint: "#4ade80",
        violet: "#a78bfa"
      },
      boxShadow: {
        glass: "0 22px 70px rgba(15,23,42,.16)"
      }
    }
  },
  plugins: []
};
