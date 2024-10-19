/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0', visibility: 'hidden' },
                },
                'slide-left': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'slide-right': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(100%)', visibility: 'hidden' }, // Hide on exit
                },
                'enter': {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.8) translateX(100%)',
                        visibility: 'hidden',
                    },
                    '1%': {
                        visibility: 'visible',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1) translateX(0)',
                    },
                },
                'exit': {
                    '0%': {
                        opacity: '1',
                        transform: 'scale(1) translateX(0)',
                        visibility: 'visible',
                    },
                    '100%': {
                        opacity: '0',
                        transform: 'scale(0.8) translateX(100%)'
                    },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-in-out',
                'fade-out': 'fade-out 0.5s ease-in-out',
                'slide-left': 'slide-left 0.5s ease-in-out',
                'slide-right': 'slide-right 0.5s ease-in-out',
                'enter': 'enter 0.3s ease-out forwards',
                'exit': 'exit 0.3s ease-out forwards',
            },
            maxWidth: {
                '18': '4.5rem',
            },
        }
    },
    plugins: [
        'prettier-plugin-tailwindcss',
        require('tailwindcss-animate'),
    ],
};
export default config;
