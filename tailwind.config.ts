import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "kings-blue": "#1E5FDB",
        "kings-blue-dark": "#12419E",
        "kings-gold": "#FFC700",
        "kings-red": "#E32226",
      },
      fontFamily: {
        display: ["var(--font-bangers)", "cursive"],
        heading: ["var(--font-chakra)", "sans-serif"],
        sans: ["var(--font-chakra)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
