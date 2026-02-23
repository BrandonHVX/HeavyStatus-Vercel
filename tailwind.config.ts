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
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#e94560",
        "accent-hover": "#d63851",
        "accent-light": "#fef2f4",
        muted: "#94a3b8",
        light: "#f8fafc",
        surface: "#ffffff",
        "surface-alt": "#f1f5f9",
        border: "#e2e8f0",
        "border-light": "#f1f5f9",
        "card-shadow": "rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        heading: ['"EB Garamond"', 'Georgia', 'serif'],
        serif: ['"EB Garamond"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'card-sm': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'nav': '0 -2px 12px rgba(0, 0, 0, 0.06)',
        'float': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'search': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      letterSpacing: {
        'widest': '0.25em',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-bottom': 'slideInBottom 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
