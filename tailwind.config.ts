
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#03A9F4',
					foreground: '#ffffff',
					50: '#E1F5FE',
					100: '#B3E5FC',
					500: '#03A9F4',
					600: '#0288D1',
					700: '#0277BD'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: '#F8F9FA',
					foreground: '#6C757D'
				},
				accent: {
					DEFAULT: '#E3F2FD',
					foreground: '#1976D2'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#212529'
				},
				sidebar: {
					DEFAULT: '#FFFFFF',
					foreground: '#495057',
					primary: '#03A9F4',
					'primary-foreground': '#FFFFFF',
					accent: '#F8F9FA',
					'accent-foreground': '#495057',
					border: '#E9ECEF',
					ring: '#03A9F4'
				},
				// Podio-inspired colors
				'podio-primary': '#03A9F4',
				'podio-secondary': '#6C757D',
				'podio-background': '#FFFFFF',
				'podio-surface': '#F8F9FA',
				'podio-border': '#E9ECEF',
				'podio-hover': '#E3F2FD',
				'podio-text': '#212529',
				'podio-text-muted': '#6C757D',
			},
			borderRadius: {
				lg: '8px',
				md: '6px',
				sm: '4px'
			},
			boxShadow: {
				'podio': '0 1px 3px rgba(0, 0, 0, 0.1)',
				'podio-hover': '0 2px 8px rgba(0, 0, 0, 0.15)',
			},
			keyframes: {
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
