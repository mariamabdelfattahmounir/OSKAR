/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488',
          hover: '#0f766e',
          active: '#115e59',
          container: '#ccfbf1',
        },
        surface: {
          DEFAULT: 'var(--surface-container-lowest, #ffffff)',
          container: {
            lowest: '#ffffff',
            low: '#f8fafc',
            high: '#e2e8f0',
            highest: '#cbd5e1',
          },
        },
        'dark-surface': '#0b1329',
        'dark-card': '#0f172a',
        'on-surface': {
          DEFAULT: '#0f172a',
          variant: '#64748b',
        },
        outline: {
          DEFAULT: '#94a3b8',
          variant: '#cbd5e1',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'container-max': '1400px',
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      },
    },
  },
  plugins: [],
};
