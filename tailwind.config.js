/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  darkMode: "class", // ← required for manual dark mode toggling
  theme: {
    extend: {
      colors: {
        primaryLight: "#0435d4",
        gold: "#deae29",
        primary: "#008253",
        accent: "#ff6523",
        secondary: "#F5EBDC",
        secondaryLinen: "#F9F9F7",
        light: "#1C1C1C",
        contrast: "#333333",
        link: "#001ad6",
        one_star: "#FF3722",
        two_star: "#FF8622",
        three_star: "#FFCE00",
        four_star: "#73CF11",
        five_star: "#00B67A",
        stars: {},
      },
      boxShadow: {
        bottom:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
        "bottom-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
