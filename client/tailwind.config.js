export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#BB2E29",
          dark: "#A02622",
          text: "#FFFFFF",
        },

        base: {
          background: "#FFFFFF",
          text: "#000000",
        },

        ui: {
          card: "#E5E4E4",
        },

        accent: {
          DEFAULT: "#FFCC00",
        },
      },
    },
  },
  plugins: [],
};
