/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen-Sans',
          'Ubuntu',
          'Cantarell',
          '"Helvetica Neue"',
          'sans-serif'
        ],
      },
      colors: {
        setel: {
          50: '#e0f9ff',
          100: '#b3efff',
          200: '#80e5ff',
          300: '#4ddbff',
          400: '#1ad1ff',
          500: '#00BFFF', // Vibrant Cyan (primary)
          600: '#0099cc',
          700: '#253DE8', // Deep Blue (accents/hovers)
          800: '#1e31ba',
          900: '#17258c',
        }
      }
    },
  },
  plugins: [],
}
