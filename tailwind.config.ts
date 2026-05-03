import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        player: {
          red: "#ef4444",
          blue: "#3b82f6",
          green: "#22c55e",
          yellow: "#eab308",
          purple: "#a855f7",
          orange: "#f97316",
        },
      },
    },
  },
  plugins: [],
};

export default config;
