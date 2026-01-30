/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Replacing "neon" with specific clean colors based on the image
        app: {
          bg: '#121212',       // Very dark grey/black
          card: '#1e1e1e',     // Slightly lighter for cards
          text: '#ffffff',     // White text
          muted: '#b0b0b0',    // Muted text
          blue: '#007bff',     // Bootstrap-ish blue
          blueHover: '#0056b3',
          border: '#333333'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We'll need to import Inter
      }
    },
  },
  plugins: [],
}
