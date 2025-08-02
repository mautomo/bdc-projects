/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#061635',
        'brand-blue': '#103c5a', 
        'brand-cyan': '#1cbede',
        'brand-yellow': '#f7c906',
      }
    },
  },
  plugins: [],
}