import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navyDeep: "#071A2B",
        saffron: "#FF8A00",
        emergencyRed: "#E53935",
        safetyTeal: "#00A896",
        lightBg: "#F4F7FA",
        darkBg: "#050D16",
        darkCard: "#0D2235",
        consoleVoid: "#050D16",
        consoleSignal: "#E53935",
        consoleAmber: "#FF8A00",
        consoleGreen: "#00A896",
        consoleSteel: "#8A9BA8",
        consoleWhite: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
        sans: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
        devanagari: ["var(--font-noto-devanagari)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
