/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        'custom-color': '#164863',
        'custom-color-dark': '#0f3b4e',
      },
    },
  },
  plugins: [],
};
