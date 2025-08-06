/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mercado-yellow': '#fff159',
                'mercado-blue': '#2D3176',
                'mercado-original-blue': '#3483fa',
                'mercado-blue-hover': '#2968c8',
                'mercado-green': '#00a650',
                'mercado-light-blue': '#e6f7ff',
                'mercado-gray': '#666666',
                'mercado-light-gray': '#f5f5f5'
            },
            fontFamily: {
                'sans': [
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'Noto Sans',
                    'Liberation Sans',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji'
                ]
            },
            boxShadow: {
                'card': '0 2px 4px rgba(0,0,0,0.1)',
                'card-hover': '0 4px 8px rgba(0,0,0,0.15)'
            }
        },
    },
    plugins: [],
}