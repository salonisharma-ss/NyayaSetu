import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#081a33",
        blue: "#3157d5",
        gold: "#d9a441",
        ink: "#121b2a",
        canvas: "#f6f8fc",
        muted: "#5f6f85",
        success: "#1f9d67",
      },
    },
  },
  plugins: [],
} satisfies Config;