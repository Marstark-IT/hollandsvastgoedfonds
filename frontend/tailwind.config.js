/** @type {import('tailwindcss').Config} */
// Visual system modelled on sonsrealestate.nl (solid photo hero with white card,
// coloured USP band, overlay service cards, process band, dark footer), in the
// Hollands Vastgoedfonds palette. Change `brand`/`band` to re-colour the site.
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0F3B5F", dark: "#0A2B46" },
        band: "#1F5F86",
        accent: { DEFAULT: "#B45208", hover: "#933F04" },
        ink: "#1E2A33",
        muted: "#4A5561",
        soft: "#F3F4F4",
        line: "#D9DEE2",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { DEFAULT: "3px" },
      maxWidth: { site: "1200px" },
      boxShadow: { card: "0 10px 30px -12px rgba(15, 59, 95, 0.25)" },
    },
  },
  plugins: [],
};
