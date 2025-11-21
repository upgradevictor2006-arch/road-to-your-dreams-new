/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#135bec",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
        "sunset-orange": "#FF7A59",
        "off-white": "#F5F5F5",
        "text-light": "#333333",
        "text-dark": "#E0E0E0",
        "subtle-light": "#666666",
        "subtle-dark": "#A0A0A0",
        "card-light": "#FFFFFF",
        "card-dark": "#192233",
        "progress-bg-light": "#E0E0E0",
        "progress-bg-dark": "#333333",
        "accent": "#F5A623",
        "accent-orange": "#FF6347",
        "accent-green": "#228B22",
        "road-color": "#2D2D2D",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1A2233",
        "border-light": "#E2E8F0",
        "border-dark": "#334155",
        "placeholder": "#B0B0B0",
        "field-light": "#FFFFFF",
        "field-dark": "#1E293B",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

