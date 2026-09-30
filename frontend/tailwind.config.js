/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          dark: "#0F0F1A",
          card: "#1A1A2E",
          cardHover: "#23233D",
          orange: "#FF4500",
          orangeHover: "#E03E00",
          accent: "#FF6B00",
          text: "#E2E8F0",
          muted: "#94A3B8",
          border: "#2E2E48"
        }
      }
    },
  },
  plugins: [],
}
