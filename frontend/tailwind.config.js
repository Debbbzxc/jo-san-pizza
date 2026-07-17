/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:    '#D62B2B',
          orange: '#EA580C',
          yellow: '#F5C518',
          green:  '#10B981',
          dark:   '#0F172A',
          cream:  '#FFF7ED',
          muted:  '#FDF4F0',
          border: '#FCEAE1',
        },
      },
      fontFamily: {
        display: ['"Playfair Display SC"', 'serif'],
        sans:    ['Karla', '"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
