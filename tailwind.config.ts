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
        accent: "#df4a2c",
        "accent-hover": "#c73e22",
        muted: "#757575",
        light: "#f8f9fa",
        border: "#e5e5e5",
      },
      fontFamily: {
        heading: ['"EB Garamond"', 'Georgia', 'serif'],
        serif: ['"EB Garamond"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      letterSpacing: {
        'widest': '0.25em',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
