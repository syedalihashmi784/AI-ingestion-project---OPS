import type { Config } from 'tailwindcss'

const config: Config = {
  // Tell Tailwind which files to scan for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colours matching the project brand
      colors: {
        navy: '#1F3A5F',
        oxblood: '#7A1F2B',
        moss: '#4A5A3A',
        gold: '#A8834A',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
