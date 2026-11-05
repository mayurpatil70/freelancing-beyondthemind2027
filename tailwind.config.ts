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
        emerald: {
          950: "#031713",
          900: "#07261F",
          850: "#093028",
          800: "#0B3830",
          700: "#124E43",
          600: "#1A6B5C",
        },
        gold: {
          100: "#FAF4DC",
          200: "#F5E5A4",
          300: "#E6C875",
          400: "#DFC26B",
          500: "#D4AF37",
          600: "#C5A059",
          700: "#9E7B35",
          800: "#755A25",
        },
        ivory: {
          50: "#FAF8F5",
          100: "#F2EDE4",
          200: "#E5DDD0",
          300: "#D8D1C3",
        },
        charcoal: {
          900: "#121512",
          800: "#191D19",
          700: "#222722",
        },
        stone: {
          subtle: "#D8D1C3",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5E5A4 0%, #D4AF37 50%, #C5A059 100%)",
        "gold-radial": "radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
        "emerald-radial": "radial-gradient(circle at top center, #0B3830 0%, #031713 100%)",
        "emerald-glow": "radial-gradient(ellipse at 50% 0%, rgba(18, 78, 67, 0.4) 0%, transparent 60%)",
      },
      boxShadow: {
        "gold-sm": "0 2px 10px rgba(212, 175, 55, 0.12)",
        "gold-md": "0 4px 20px rgba(212, 175, 55, 0.2)",
        "emerald-deep": "0 20px 40px -15px rgba(3, 23, 19, 0.7)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

