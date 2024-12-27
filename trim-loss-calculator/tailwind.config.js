/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // React için uygun dosya uzantıları
  ],
  theme: {
    extend: {
      colors: {
        bordo: {
          DEFAULT: "#800000", // Varsayılan bordo rengi
          dark: "#4B0000", // Koyu bordo
        },
      },
    },
  },
  plugins: [],
};