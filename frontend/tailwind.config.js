/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0F1115',
          card: '#1A1D24',
          border: 'rgba(212, 175, 55, 0.1)',
          text: '#9E9E9E',
          accent: '#D4AF37',
          accentLight: '#E6C97A',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.15)',
        'glow-beige': '0 0 25px rgba(230, 201, 122, 0.2)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}
