/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        'light-bg-main': 'rgb(var(--light-bg-main) / <alpha-value>)',
        'light-bg-sec': 'rgb(var(--light-bg-sec) / <alpha-value>)',
        'text-main': 'rgb(var(--text-main) / <alpha-value>)',
        'text-sec': 'rgb(var(--text-sec) / <alpha-value>)',
        'accent-green': 'rgb(var(--accent-green) / <alpha-value>)',
        'button-orange': 'rgb(var(--button-orange) / <alpha-value>)',
        'button-text': 'rgb(var(--button-text) / <alpha-value>)',
        'divider': 'rgb(var(--divider) / <alpha-value>)',
  
        primary: '#C8A96E',
        secondary: '#2D7D6E',
        tertiary: '#8B5E3C',
        danger: '#D43F34',
        warning: '#E8A84C',
        info: '#4A8DB7',
        dark: {
          bg: '#0A0A0F',
          surface: '#14141E',
          elevated: '#1C1C2E',
          text: '#FFFFFF',
          muted: '#B8B5B0',
          tertiary: '#8A8780',
        },
        light: {
          bg: '#F8F7F4',
          surface: '#FFFFFF',
          elevated: '#F0EFEB',
          text: '#1A1A1A',
          muted: '#4A4A4A',
          tertiary: '#7A7A7A',
        }
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        none: '0px',
      }
    },
  },
  plugins: [],
}
