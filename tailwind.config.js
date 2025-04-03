/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#3490dc',
          700: '#2779bd',
          900: '#1a365d',
        },
        green: {
          600: '#38a169',
          700: '#2f855a',
        }
      },
    },
  },
  plugins: [],
}