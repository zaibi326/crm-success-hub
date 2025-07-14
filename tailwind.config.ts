
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
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: '#E3F2FD',
					100: '#BBDEFB',
					500: '#2184F7',
					600: '#1976D2',
					700: '#1565C0'
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
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// AgileCRM color palette
				'agile-blue': {
					DEFAULT: '#2184F7',
					50: '#E3F2FD',
					100: '#BBDEFB', 
					500: '#2184F7',
					600: '#1976D2',
					700: '#1565C0'
				},
				'agile-green': {
					DEFAULT: '#28A745',
					50: '#D4EDDA',
					100: '#C3E6CB',
					500: '#28A745',
					600: '#218838',
					700: '#1E7E34'
				},
				'agile-coral': {
					DEFAULT: '#FF7F50',
					50: '#FFE5D9',
					100: '#FFCCB3',
					500: '#FF7F50',
					600: '#FF6347',
					700: '#FF4500'
				},
				'agile-red': {
					DEFAULT: '#DC3545',
					50: '#F8D7DA',
					100: '#F1B0B7',
					500: '#DC3545',
					600: '#C82333',
					700: '#BD2130'
				},
				'agile-purple': {
					DEFAULT: '#6F42C1',
					50: '#E2D9F3',
					100: '#C5B3E6',
					500: '#6F42C1',
					600: '#5A32A3',
					700: '#4C2A85'
				},
				'agile-gray': {
					50: '#F9FAFB',
					100: '#F3F4F6',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9CA3AF',
					500: '#6B7280',
					600: '#555555',
					700: '#374151',
					800: '#333333',
					900: '#111827'
				}
			},
			borderRadius: {
				lg: '8px',
				md: '6px',
				sm: '4px'
			},
			boxShadow: {
				'agile': '0 2px 8px rgba(0, 0, 0, 0.1)',
				'agile-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
				'agile-card': '0 1px 3px rgba(0, 0, 0, 0.1)',
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
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'bounce-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.3)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.05)'
					},
					'70%': {
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'ripple': {
					'0%': {
						transform: 'scale(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(4)',
						opacity: '0'
					}
				}
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'ripple': 'ripple 0.6s linear'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
