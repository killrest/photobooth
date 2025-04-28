/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFEF8",
          100: "#FFFDF0",
          200: "#FFF9E0",
          300: "#FFF7D6",
          400: "#FFF3C2",
          500: "#FFEFAD",
          600: "#FFEA99",
          700: "#FFE47A",
          800: "#FFDF5C",
          900: "#FFD321"
        },
        amber: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFC107",
          600: "#FFB300",
          700: "#FFA000",
          800: "#FF8F00",
          900: "#FF6F00"
        }
      }
    }
  },
  plugins: []
};
