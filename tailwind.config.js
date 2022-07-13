/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: "#D9D9D9",
        grey2: "#ECE2E2",
        pri: "#003C71",
        green: "#899E4C",
        second: "#EDFBFF",
        orange: "#FF9E1B",
      },
    },
  },
  plugins: [],
};
