import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#000000",
        secondary: "#1a1a1a",
        accent: "#c41e3a",
        muted: "#757575",
        light: "#f5f5f5",
        border: "#e5e5e5",
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      letterSpacing: {
        'widest': '0.25em',
      },
    },
  },
  plugins: [],
} satisfies Config;
