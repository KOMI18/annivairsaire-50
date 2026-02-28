/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'anniv-blue': '#003366', // Un bleu nuit profond et élégant
        'anniv-white': '#FFFFFF',
      },
      fontFamily: {
        // Optionnel : Pour un look premium, utilise une police Serif
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}