import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors');

export default {
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class'],
  safelist: ['dark'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: colors.orange,
        gray: colors.gray,
        blue: colors.blueGray,
        white: colors.white,
      },
      backgroundImage: theme => ({
        'hero': "url('/hero.png')",
        'action': "url('/src/assets/action.png')",
       })
    },
  },
  plugins: [],
} satisfies Config;
