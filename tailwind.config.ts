import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class", "media"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'sm': '0 5px 15px -5px var(--shadow-sm)',
        'md': '0 5px 15px -5px var(--shadow-md)',
        'lg': '0 5px 15px -5px var(--shadow-lg)',
        'xl': '0 5px 15px -5px var(--shadow-xl)',
        '2xl': '0 5px 15px -5px var(--shadow-2xl)',
        '3xl': '0 10px 30px -5px var(--shadow-3xl)',
        '4xl': '0 15px 40px -5px var(--shadow-4xl)',
        '5xl': '0 20px 50px -5px var(--shadow-5xl)',
      },
      
      animation: {
        flip: "flip 0.6s ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      rotate: {
        "y-180": "rotateY(180deg)",
      },
      perspective: {
        "1000": "1000px",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
