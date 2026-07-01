import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary - Sport Green
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e', // Main brand color
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                // Background (Dark Mode)
                background: {
                    DEFAULT: '#0a0a0a',
                    secondary: '#171717',
                    tertiary: '#262626',
                    hover: '#2a2a2a',
                },
                // Text colors
                foreground: {
                    DEFAULT: '#fafafa',
                    secondary: '#a3a3a3',
                    muted: '#737373',
                },
                // Border
                border: {
                    DEFAULT: '#262626',
                    focus: '#22c55e',
                },
                // Semantic
                success: '#22c55e',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',
                // Booking status
                booking: {
                    confirmed: '#3b82f6',
                    'in-progress': '#22c55e',
                    pending: '#f59e0b',
                    completed: '#6b7280',
                    cancelled: '#ef4444',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                sm: '0.25rem',
                DEFAULT: '0.5rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                glow: '0 0 20px rgba(34, 197, 94, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 200ms ease-out',
                'slide-up': 'slideUp 200ms ease-out',
                'slide-down': 'slideDown 200ms ease-out',
                'slide-in-right': 'slideInRight 300ms ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(100%)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}

export default config
