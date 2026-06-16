/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./assets/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brandDark: '#030712',
        brandNavy: '#0b1329',
        brandBlue: '#16223f',
        brandCyan: '#00f2fe',
        brandOrange: '#ff823a',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
