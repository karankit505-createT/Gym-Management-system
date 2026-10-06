/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Barlow Condensed', 'sans-serif'],
      },
      colors: {
        gym: {
          dark: "#F8F9FA",
          card: "#FFFFFF",
          cardHover: "#F3F4F6",
          orange: "#EA580C",
          orangeHover: "#C2410C",
          accent: "#EA580C",
          text: "#1F2937",
          muted: "#4B5563",
          border: "#E5E7EB",
          navy: "#1F2937"
        }
      },
      borderRadius: {
        'crisp': '6px',
        'editorial': '8px'
      }
    },
  },
  plugins: [],
}
