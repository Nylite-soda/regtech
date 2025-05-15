import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow-reverse': 'spin 3s linear infinite reverse',
        'spin-reverse': 'spin 1.5s linear infinite reverse',
      },
      keyframes: {
        loadingProgress: {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '100%': { width: '100%' }
        }
      },
      borderWidth: {
        '6': '6px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config; 