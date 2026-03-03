/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050e1d",
          900: "#0A1628",
          800: "#0f1f3d",
          700: "#112240",
          600: "#172a50",
          500: "#1e3a6e",
          400: "#2a4f8f",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0C860",
          dark: "#A88B1C",
          50: "#fefaed",
          100: "#fdf3cc",
        },
        surface: {
          DEFAULT: "#112240",
          hover: "#172a50",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        gold: "0 0 20px rgba(212, 175, 55, 0.15)",
        "gold-lg": "0 0 40px rgba(212, 175, 55, 0.2)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37, #F0C860)",
        "navy-gradient": "linear-gradient(135deg, #0A1628, #1e3a6e)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
}