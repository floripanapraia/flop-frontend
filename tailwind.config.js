/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // substitui a padrão
      },
      colors: {
        'primary-blue': '#253F64',

        blue: {
          600: '#3490dc',
          700: '#2779bd',
          900: '#253F64',
          
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