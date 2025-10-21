/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prajashakthi': {
          'maroon': '#A8234A',
          'orange': '#F37021',
          'maroon-dark': '#8B1C3D',
          'orange-dark': '#D65F1A',
          'cream': '#F5E6D3',
          'cream-light': '#FFF8E7',
        }
      }
    },
  },
  plugins: [],
}