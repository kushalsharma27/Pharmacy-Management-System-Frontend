/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Add this line to enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f8f8',
          100: '#e6f1f1',
          200: '#c0d9d9',
          300: '#9ac1c1',
          400: '#4f8f8f',
          500: '#0F3D3E',  // Deep Teal
          600: '#0e3738',
          700: '#0b2e2f',
          800: '#092526',
          900: '#071e1f',
        },
        secondary: {
          50: '#f7faf8',
          100: '#eff5f1',
          200: '#d7e6dd',
          300: '#bfd7c9',
          400: '#8fb8a1',
          500: '#6B8E7A',  // Warm Sage
          600: '#60806e',
          700: '#506b5c',
          800: '#405649',
          900: '#34463c',
        },
        accent: {
          50: '#fff5f5',
          100: '#ffebeb',
          200: '#ffcece',
          300: '#ffb0b0',
          400: '#ff7676',
          500: '#FF6B6B',  // Coral
          600: '#e66060',
          700: '#bf5050',
          800: '#994040',
          900: '#7d3434',
        },
        warning: {
          50: '#fff8f0',
          100: '#fef1e0',
          200: '#fddbb9',
          300: '#fcc592',
          400: '#fa9a45',
          500: '#F9B572',  // Golden
          600: '#e0a367',
          700: '#bb8854',
          800: '#956d43',
          900: '#7a5936',
        },
        success: {
          50: '#f6fbf9',
          100: '#ecf7f3',
          200: '#d1ebe2',
          300: '#b5dfd1',
          400: '#7ec7af',
          500: '#A7D7C5',  // Mint
          600: '#96c2b1',
          700: '#7da194',
          800: '#648176',
          900: '#526960',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.05)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
      },
    },
  },
  plugins: [],
}