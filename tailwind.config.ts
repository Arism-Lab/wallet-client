import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Sarabun', 'sans-serif'],
        },
        extend: {
            colors: {
                primary: {
                    50: 'var(--primary-50)',
                    100: 'var(--primary-100)',
                    200: 'var(--primary-200)',
                    300: 'var(--primary-300)',
                    400: 'var(--primary-400)',
                    500: 'var(--primary-500)',
                    600: 'var(--primary-600)',
                    700: 'var(--primary-700)',
                    800: 'var(--primary-800)',
                    900: 'var(--primary-900)',
                    950: 'var(--primary-950)',
                },
                secondary: {
                    50: 'var(--secondary-50)',
                    100: 'var(--secondary-100)',
                    200: 'var(--secondary-200)',
                    300: 'var(--secondary-300)',
                    400: 'var(--secondary-400)',
                    500: 'var(--secondary-500)',
                    600: 'var(--secondary-600)',
                    700: 'var(--secondary-700)',
                    800: 'var(--secondary-800)',
                    900: 'var(--secondary-900)',
                    950: 'var(--secondary-950)',
                },
                tertiary: {
                    50: 'var(--tertiary-50)',
                    100: 'var(--tertiary-100)',
                    200: 'var(--tertiary-200)',
                    300: 'var(--tertiary-300)',
                    400: 'var(--tertiary-400)',
                    500: 'var(--tertiary-500)',
                    600: 'var(--tertiary-600)',
                    700: 'var(--tertiary-700)',
                    800: 'var(--tertiary-800)',
                    900: 'var(--tertiary-900)',
                    950: 'var(--tertiary-950)',
                },
            },
            backgroundImage: {
                radial: 'radial-gradient(, var(--tw-gradient-stops))',
                conic: 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [require('tailwindcss/nesting'), require('postcss-nesting')],
}
export default config
