/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFD700',
        'brand-cream': '#F2F1EC',
        'brand-dark': '#0B0B0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        technical: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
