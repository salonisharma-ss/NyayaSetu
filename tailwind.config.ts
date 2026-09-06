import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        brand: { DEFAULT: "#1e3a8a", light: "#3b82f6" },
      },
    },
  },
  plugins: [],
} satisfies Config;
