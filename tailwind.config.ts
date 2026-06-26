import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0610",
        surface: "#150B1F",
        brand: { DEFAULT: "#5A2676", deep: "#3B1851" },
        violet: "#A855F7",
        magenta: "#FF5DA2",
        paper: "#F5F0FA",
        muted: "#9A8FA8",
        // legacy alias so older components keep compiling
        accent: { DEFAULT: "#A855F7", deep: "#5A2676", soft: "#FF5DA2" },
      },
      fontFamily: {
        display: ['"Clash Display"', "var(--font-sans)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
} satisfies Config;
