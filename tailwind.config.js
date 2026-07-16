/** @type {import('tailwindcss').Config} */
module.exports = {
  // Matches App.tsx and any components/screens in src directory
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Default Lavender Pastels theme colors (we can also map them to CSS variables later)
        primary: {
          light: "#8C7AB8",
          dark: "#584B82",
          DEFAULT: "#8C7AB8",
        },
        sage: {
          DEFAULT: "#4B7E4F",
        },
        peach: {
          DEFAULT: "#F29F8F",
        },
        cream: {
          light: "#FBFBFD",
          DEFAULT: "#FBFBFD",
          dark: "#F5F3F7",
        },
        divider: {
          DEFAULT: "#EBEBEB",
        }
      },
      fontFamily: {
        outfit: ["Outfit_400Regular", "Outfit_500Medium", "Outfit_600SemiBold", "Outfit_700Bold", "sans-serif"],
      }
    },
  },
  plugins: [],
};
