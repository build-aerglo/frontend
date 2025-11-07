/** @type {import('tailwindcss').Config} */
export default {
  content: [],
   darkMode: 'class', // ← required for manual dark mode toggling
  theme: {
    extend: {
      colors: {
        primaryLight: "#0435d4",
        gold: "#deae29",
        primary: '#008253',
        accent: "#ff6523",
        secondary: "#F5EBDC",
        secondaryLinen: "#F9F9F7",
        light: "#1C1C1C",
        contrast: "#333333",
        link: "#001ad6",
        
      },
      boxshadow: {
        'tiny': '0 1px 2px rgba(0, 0, 0, 0.4)'
      }
    },
  },
  plugins: [],
};
