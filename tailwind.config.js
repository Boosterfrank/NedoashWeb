/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f3ff',
          pink: '#ff00ff',
          orange: '#ff9900',
          dark: '#0a0a12',
          surface: '#151520'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We'll need to import Inter
      }
    },
  },
  plugins: [],
}
