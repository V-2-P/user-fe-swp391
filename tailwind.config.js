/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'button-shadow': '0px 10px 20px 0px rgba(0, 0, 0, 0.15);'
      }
    }
  },
  plugins: []
}
