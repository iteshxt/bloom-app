/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // MD3 Bloom Theme Colors
        primary: {
          DEFAULT: '#2E7D32', // Bloom Green
          on: '#FFFFFF',
          container: '#E8F5E9',
          onContainer: '#1B5E20',
        },
        secondary: {
          DEFAULT: '#4A7C59', // Calm Slate/Teal
          on: '#FFFFFF',
          container: '#D8F3DC',
          onContainer: '#1B4332',
        },
        tertiary: {
          DEFAULT: '#6750A4', // Soft Purple (Partner/Shared)
          on: '#FFFFFF',
          container: '#E8DDFF',
          onContainer: '#21005D',
        },
        surface: {
          DEFAULT: '#FDFDFD', // Muted Light Background
          on: '#1C1B1F',
          variant: '#E7E0EC',
          onVariant: '#49454F',
        },
        outline: {
          DEFAULT: '#79747E',
        },
        error: {
          DEFAULT: '#B3261E', // Alert Red
          container: '#F9DEDC',
          onContainer: '#410E0B',
        },
      },
    },
  },
  plugins: [],
}
